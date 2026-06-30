const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.PEXELS_API_KEY;

if (!API_KEY) {
    console.error("❌ PEXELS_API_KEY not found in .env");
    process.exit(1);
}

const SEARCH_URL = "https://api.pexels.com/v1/search";

const INPUT_FILE = "./data/products.js";
const OUTPUT_FILE = "./data/products.updated.js";
const CACHE_FILE = "./image-cache.json";


const usedImages = new Set();

let cache = {};

if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
}

function saveCache() {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function buildQueries(product) {
    const queries = [];

    queries.push(`${product.gender} ${product.name}`);

    if (product.material)
        queries.push(`${product.gender} ${product.material} ${product.name}`);

    if (product.collections)
        queries.push(`${product.gender} ${product.collections}`);

    if (product.category)
        queries.push(`${product.gender} ${product.category}`);

    const type = product.name.split(" ").slice(-2).join(" ");
    queries.push(`${product.gender} ${type}`);

    queries.push(product.name);

    return [...new Set(queries)];
}

async function search(query, page = 1) {
    try {
        const { data } = await axios.get(SEARCH_URL, {
            headers: {
                Authorization: API_KEY
            },
            params: {
                query,
                per_page: 10,
                page
            }
        });

        return data.photos || [];
    } catch (err) {

        if (err.response?.status === 429) {
            console.log("Rate limited... waiting...");
            await sleep(5000);
            return search(query, page);
        }

        return [];
    }
}

async function getUniqueImages(product) {

    if (cache[product.name]) {

        product.images = cache[product.name];
        product.images.forEach(img => usedImages.add(img.url));
        return;
    }

    const queries = buildQueries(product);

    const needed = product.images.length;

    const selected = [];

    for (const query of queries) {

        const photos = await search(query);

        for (const photo of photos) {

            const url = photo.src.large2x;

            if (usedImages.has(url))
                continue;

            usedImages.add(url);

            selected.push(url);

            if (selected.length === needed)
                break;
        }

        if (selected.length === needed)
            break;
    }

    if (!selected.length) {

        console.log(`❌ ${product.name}`);
        return;
    }

    while (selected.length < needed)
        selected.push(selected[0]);

    product.images = product.images.map((img, i) => ({
        url: selected[i],
        altText: img.altText
    }));

    cache[product.name] = product.images;

    saveCache();

    console.log(`✅ ${product.name}`);
}

async function main() {

    const products = require(path.resolve(INPUT_FILE));

    console.log(`Found ${products.length} products\n`);

    let count = 1;

    for (const product of products) {
    console.log(`[${count++}/${products.length}] Searching ${product.name}`);
    await getUniqueImages(product);
    await sleep(300); // Helps avoid rate limiting
}

    const output =
        "const products = " +
        JSON.stringify(products, null, 2) +
        ";\n\nmodule.exports = products;\n";

    fs.writeFileSync(OUTPUT_FILE, output);

    console.log("\n🎉 Finished!");
    console.log(`Saved to ${OUTPUT_FILE}`);
}
main();