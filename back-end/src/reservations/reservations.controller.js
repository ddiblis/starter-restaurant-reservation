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

// function bodyDataHas(propertyName) {
//   return (req, res, next) => {
//     const { data = {} } = req.body;
//     const value = data[propertyName];
//     if (!value || value == "") {
//       return next({ status: 400, message: `Plant must include a ${propertyName}` });
//     }
//     next();
//   };
// }

// function hasValidFields(req, res, next){
//   bodyDataHas("first_name")
//   bodyDataHas("last_name")
//   bodyDataHas("mobile_number")
//   bodyDataHas("reservation_date")
//   bodyDataHas("reservation_time")
// }



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
  create: create,
};
