/**
 * List handler for reservation resources
 */
const { listRes, singleRes, addRes } = require("./reservations.services")

async function idValid(req, res, next) {
  const { reservation_id } = req.params
  const error = { status: 404, message: `Reservation ${reservation_id} does not exist`}
  if(!reservation_id) next(error)
  const data = await singleRes(reservation_id)
  if (!data) next(error)
  next()
}

function bodyDataHas(propertyName) {
  return (req, res, next) => {
    const { data = {} } = req.body;
    const value = data[propertyName];
    const error = { status: 400, message: `Reservation must include a valid ${propertyName}` }

    if (!value || value == "") {
      return next(error);
    }
    next();
  };
}

function hasPeople(propertyName){
  return (req, res, next) => {
    const { data = {} } = req.body;
    const value = data[propertyName];
    const error = { status: 400, message: `Reservation must include a valid ${propertyName}` }

    if(!value || value == "" || typeof(value) !== "number") {
      return next(error)
    }
    next()
  }
}

function hasResTime(propertyName){

  return async (req, res, next) => {
    const error = { status: 400, message: `Reservation must include a valid ${propertyName}` }
    const { data = {} } = req.body;
    const value = data[propertyName];
    const date = data.reservation_date
    const resDate = Date.parse(date)
    let notExists


    if(!isNaN(resDate)) {
      const listByDate = await listRes(date)
      notExists = listByDate.every(res => res.reservation_time !== value)
    }

    if(!value) return next(error)

    const timeSplit = value.split(":").every(sec => sec.length === 2)
    

    if(value == "" || timeSplit == false || notExists == false){
      return next(error)
    }
    next()
  }
}

function hasResDate(propertyName){
  return (req, res, next) => {
    const error = { status: 400, message: `Reservation must include a valid ${propertyName}` }
    const { data = {} } = req.body
    const value = data[propertyName];
    const resDate = Date.parse(value)
    const weekDay = new Date(value).getDay()
    
    if(resDate < Date.now()){
      return next({ status: 400, message: "Reservation must be at a future date."})
    }

    if(weekDay === 1){
      return next({ status: 400, message: "Restaurant is closed on tuesdays, no reservations allowed."})
    }
    
    if(!value || value == "" || isNaN(resDate)){
      return next(error)
    }
    next()
  }
}

const hasFirstName = bodyDataHas("first_name")
const hasLastName = bodyDataHas("last_name")
const hasPhoneNumber = bodyDataHas("mobile_number")
const hasReservationDate = hasResDate("reservation_date")
const hasReservationTime = hasResTime("reservation_time")
const hasNumOfPeople = hasPeople("people")

async function create(req, res){
  const data = await addRes(req.body.data)
  res.status(201).json({ data })
}

async function list(req, res) {
  const date = req.query.date
  const data = await listRes(date)
  res.json({ data });
}

async function getReservation(req, res){
  const { reservation_id } = req.params
  const data = await singleRes(reservation_id)
  res.json({ data })
}

module.exports = {
  list,
  get: [idValid, getReservation],
  create: [hasFirstName,
           hasLastName,
           hasPhoneNumber, 
           hasNumOfPeople, 
           hasReservationTime, 
           hasReservationDate, 
           create],
};
