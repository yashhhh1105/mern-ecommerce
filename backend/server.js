const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redis = require("./config/redis");


const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cors());

dotenv.config();

console.log(process.env.PORT);

const PORT = process.env.PORT || 3000;

//Connect to MOngoDB
connectDB();

app.get('/', (req, res) => {
    res.send("WELCOME TO HIVEKART API!");
});

//Strict limiter for auth routes -- 10 attempts per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => req.ip,

    handler: (req, res) => {
        console.log("AUTH LIMITER HIT:",req.method, req.originalUrl);
        return res.status(429).json({
            message: "Too many attempts, please try again in 15 minutes",
        });
    },

    skip: (req) => {
    console.log("AUTH CHECK:", req.method, req.originalUrl);
    return false;
    },

    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
        prefix:"auth",
    }),
});

//General limiter for all routes -- 100 requests per minutes
const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => req.ip,

    handler: (req, res) => {
        console.log("GENERAL LIMITER HIT:", req.originalUrl);
        return res.status(429).json({
            message: "Too many requests, please slow down",
        });
    },
    skip: (req) => {
    console.log("GENERAL CHECK:", req.method, req.originalUrl);
    return false;
    },
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
        prefix: "general",
    }),
});

//Apply strict limiter to auth routes only 
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);


//API Routes
app.use("/api/users",generalLimiter , userRoutes);
app.use("/api/products" ,generalLimiter , productRoutes);
app.use("/api/cart" , generalLimiter ,cartRoutes);
app.use("/api/checkout" , generalLimiter ,checkoutRoutes);
app.use("/api/orders" , generalLimiter ,orderRoutes);
app.use("/api/upload" , generalLimiter ,uploadRoutes);
app.use("/api" , generalLimiter ,subscriberRoutes);

//Admin
app.use("/api/admin/users" , generalLimiter , adminRoutes);
app.use("/api/admin/products" , generalLimiter , productAdminRoutes);
app.use("/api/admin/orders", generalLimiter, adminOrderRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});