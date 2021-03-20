const items = require("./00-tables.json")
exports.seed = function (knex) {
  return knex("tables").del()
    .then(() => {
      return knex("tables").insert(items)
    })
};