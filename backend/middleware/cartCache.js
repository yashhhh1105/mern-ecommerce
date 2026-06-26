const redis = require("../config/redis");

const CART_TTL = 900; //15 mins

const getCartCache = async (userId, guestId) => {
    try{
        const key = userId ? `cart:user:${userId}` : `cart:guest:${guestId}`;
        const data = await redis.get(key);
        if(data) {
            console.log(`Cart Cache HIT: ${key}`);
            return JSON.parse(data);
        }
        console.log(`Cart Cache MISS: ${key}`);
        return null;
    } catch (err) {
        console.error("Redis cart get error:", err.message);
        return null; //fallback to DB
    }
};

const setCartCache = async (userId, guestId, cart) => {
    try{
        const key = userId ? `cart:user:${userId}` : `cart:guest:${guestId}`;
        await redis.setex(key, CART_TTL, JSON.stringify(cart));
        console.log(`Cart Cache SET: ${key}`);
    } catch (err) {
        console.error("Redis cart set error:", err.message);
    }
};

const invalidateCartCache = async (userId, guestId) => {
    try{
        const key = userId ? `cart:user:${userId}` : `cart:guest:${guestId}`;
        await redis.del(key);
        console.log(`Cart Cache INVALIDATED: ${key}`);
    } catch (err) {
        console.error("Redis cart invalidate error:", err.message);
    }
};

module.exports = { getCartCache, setCartCache, invalidateCartCache };