const knex = require("../db/connection")

async function listTables(){
  const q = await knex("tables")
    .select("*")
    .orderBy("table_name", "asc")
    .returning("*")
  return q
}

async function getTable(tableId){
  const q = await knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .first()
  return q
}

async function addTable(newTable){
  const q = await knex("tables")
    .insert(newTable, "*")
  return q[0]
}

async function putTable(tableId, res){
  const q = await knex("tables")
    .where({ table_id: tableId })
    .update({ "reservation_id": res }, "*")
  return q[0]
}

async function delTable(tableId){
  const q = await knex("tables")
    .where({ table_id: tableId })
    .update({ "reservation_id": null }, "*")
  return q
}

module.exports = {
  listTables,
  getTable,
  addTable,
  putTable,
  delTable,
}