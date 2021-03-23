const { addTable, listTables, getTable, putTable } = require("./tables.services")
const { singleRes } = require("../reservations/reservations.services")

async function isValid(req, res, next){
  const { table_id } = req.params
  const error = { status: 404, message: `Table ${table_id} does not exist.`}
  if(!table_id) return next(error)
  const data = await getTable(table_id)
  if(!data) return next(error)
  next()
}

function hasTableName(){
  return (req, res, next) => {
    const error = { status: 400, message: `Table must include a valid table_name`}
    const { data = {} } = req.body
    const value = data.table_name
    if(!value || value == "" || value.length == 1) {
      return next(error)
    }
    next()
  }
}

function hasCapacity(){
  return (req, res, next) => {
    const error = { status: 400, message: `Table must include a valid capacity`}
    const { data = {} } = req.body
    const value = data.capacity
    if(!value || value == 0 || typeof(value) !== "number"){
      return next(error)
    } 
    next()
  }
}

const capacityTest = hasCapacity()
const tableNameTest = hasTableName()

function putIsValid(){
  return (req, res, next) => {
    if(!req.body.data) next({ status: 400 })
    const { reservation_id } = req.body.data
    if(!reservation_id) next({ status: 400, message: `data missing reservation_id`})
    next()
  }
}

function reservationValid(){
  return async (req, res, next) => {
    const { reservation_id } = req.body.data
    const reservation = await singleRes(reservation_id)
    if(!reservation) next({ status: 404, message: `Reservation ${reservation_id} does not exist`})
    next()
  }
}

function capacityValid(){
  return async (req, res, next) => {
    const { reservation_id } = req.body.data
    const { table_id } = req.params
    const reservation = await singleRes(reservation_id)
    const table = await getTable(table_id)
    if(table.capacity < reservation.people) next({ status: 400, message: `Table doesn't have enough capacity.`})
    next()
  }
}

function hasReservation(){
  return async (req, res, next) => {
    const error = { status: 400, message: "Table requested is already occupied."}
    const { table_id } = req.params
    const table = await getTable(table_id)
    if(table.reservation !== null) next(error)
    next()
  }
}

const putChecker = putIsValid()
const resChecker = reservationValid()
const capacityChecker = capacityValid()
const reservationChecker = hasReservation()

async function create(req, res){
  const newTable = req.body.data
  const data = await addTable(newTable)
  res.status(201).json({ data })
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

async function resIdPut(req, res, next){
  const { table_id } = req.params
  const { reservation_id } = req.body.data
  const data = await putTable(table_id, reservation_id)
  res.json({ data })
}

module.exports = {
  list, 
  get: [isValid, get],
  create: [
           capacityTest,
           tableNameTest,
           create],
  putSeat: [putChecker,
            resChecker,
            capacityChecker,
            reservationChecker,
            resIdPut],
}