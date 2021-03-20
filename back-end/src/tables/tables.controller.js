const { addTable, listTables, getTable } = require("./tables.services")

async function isValid(req, res, next){
  const { table_id } = req.params
  const error = { status: 404, message: `table ${table_id} does not exist.`}
  if(!table_id) return next(error)
  const data = await getTable(table_id)
  if(!data) return next(error)
  next()
}

async function list(req, res){
  const data = await listTables()
  res.json({ data })
}

async function get(req, res){
  const { table_id } = req.params
  const data = await getTable(table_id)
  res.json({ data })
}

module.exports = {
  list, 
  get: [isValid, get],
}