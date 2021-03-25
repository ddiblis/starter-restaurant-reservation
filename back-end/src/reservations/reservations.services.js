const knex = require("../db/connection")

async function listRes(date, MN) {
  // let q
  let q = knex("reservations")
    .select("*")
  if(typeof(date) == "string"){
    q = q.whereNot({ status: "finished" })
      .where({ reservation_date: date })
      .orderBy("reservation_time", "asc")
    } 
  else if(typeof(MN) == "string"){
    q = q.where("mobile_number", "like", `%${MN}%`)
  }
  // else {
  //   q = await knex("reservations")
  //     .select("*")
  //     .returning("*")
  //   }
  return await q.returning("*")
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