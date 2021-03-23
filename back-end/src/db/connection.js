const environment = process.env.NODE_ENV || "preview";
const config = require("../../knexfile")[environment];
const knex = require("knex")(config);

// console.log(process.env.NODE_ENV)
module.exports = knex;
