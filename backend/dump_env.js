import './loadEnv.js';
console.log('PORT', typeof process.env.PORT, process.env.PORT);
console.log('DB_USER', typeof process.env.DB_USER, process.env.DB_USER);
console.log('DB_PASSWORD', typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD);
console.log('DB_HOST', typeof process.env.DB_HOST, process.env.DB_HOST);
console.log('DB_NAME', typeof process.env.DB_NAME, process.env.DB_NAME);
console.log('DB_PORT', typeof process.env.DB_PORT, process.env.DB_PORT);
console.log('JWT_SECRET', typeof process.env.JWT_SECRET, process.env.JWT_SECRET);
