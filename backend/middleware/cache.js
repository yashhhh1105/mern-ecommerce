const redis = require("../config/redis");

const cache = (ttlSeconds = 300) => async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    try{
        const cached = await redis.get(key);
        if(cached) {
            console.log(`Cache HIT: ${key}`);
            return res.json(JSON.parse(cached));
        }

        console.log(`Cache MISS: ${key}`);

        //Intercept res.json to store in Redis
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            redis.setex(key, ttlSeconds, JSON.stringify(data))
              .catch(err => console.error("Redis set error:", err));
            return originalJson(data);
        }
        next();
    } catch (err) {
        console.error("Redis error, skipping cache:", err.message);
        next(); //Redis down -> fall through DB, app keeps working
    }
};

module.exports = cache;