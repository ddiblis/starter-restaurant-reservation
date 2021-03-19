const knex = require("../db/connection")

async function listRes(date) {
  let q
  if(!date){
    q = await knex("reservations")
      .select("*")
      .returning("*")
  } else {
    q = await knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time", "asc")
      .returning("*")
  }
  return q
}

async function singleRes(resId){
  const q = await knex("reservations")
    .select("*")
    .where({ reservation_id: resId })
    .first()
  return q
}

async function addRes(newRes){
  const q = await knex("reservations")
    .insert(newRes)
    .returning("*")
  return q
}

module.exports = {
  listRes,
  singleRes,
  addRes,
}