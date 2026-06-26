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
    message: {message: "Too many attempts, please try again in 15 minutes"},
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
});

//General limiter for all routes -- 100 requests per minutes
const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {message: "Too many requests, please slow down"},
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
});

//Apply strict limiter to auth routes only 
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

//Apply general limiter to all routes
app.use(generalLimiter);

//API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api",subscriberRoutes);

//Admin
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});