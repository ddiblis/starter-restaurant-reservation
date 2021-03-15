const knex = require("../db/connection")

// const res = knex("reservations as r")

async function listRes() {
  return await knex("reservations").select("*")
}

async function singleRes(reservationId){
  return await knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first()
}

module.exports = {
  listRes,
  singleRes,
}