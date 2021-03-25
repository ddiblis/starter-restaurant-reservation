const knex = require("../db/connection")

async function listRes(date, MN) {
  let q
  console.log(typeof(date), typeof(MN))
  if(typeof(date) == "string"){
    q = await knex("reservations")
      .select("*")
      .whereNot({ status: "finished" })
      .where({ reservation_date: date })
      .orderBy("reservation_time", "asc")
      .returning("*")
    } 
  else if(typeof(MN) == "string"){
    q = await knex("reservations")
      .select("*")
      .where("mobile_number", "like", `%${MN}%`)
      .returning("*")
  }
  else {
    q = await knex("reservations")
      .select("*")
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