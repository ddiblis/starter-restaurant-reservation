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
      .whereNot({ status: "finished" })
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
    .insert(newRes, "*")
  return q[0]
}

async function updateRes(resId, stat){
  const q = await knex("reservations")
    .where({ reservation_id: resId })
    .update({ status: stat }, "*")
  return q[0]
}

module.exports = {
  listRes,
  singleRes,
  addRes,
  updateRes,
}