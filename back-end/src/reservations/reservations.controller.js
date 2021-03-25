/**
 * List handler for reservation resources
 */
const {
  listRes,
  singleRes,
  addRes,
  updateResStatus,
  updateRes,
} = require("./reservations.services");

async function idValid(req, res, next) {
  const { reservation_id } = req.params;
  const error = {
    status: 404,
    message: `Reservation ${reservation_id} does not exist`,
  };
  if (!reservation_id) next(error);
  const data = await singleRes(reservation_id);
  if (!data) next(error);
  next();
}

function bodyDataHas(propertyName) {
  return (req, res, next) => {
    const { data = {} } = req.body;
    const value = data[propertyName];
    const error = {
      status: 400,
      message: `Reservation must include a valid ${propertyName}`,
    };

    if (!value || value == "") {
      return next(error);
    }
    next();
  };
}

function hasPeople(propertyName) {
  return (req, res, next) => {
    const { data = {} } = req.body;
    const value = data[propertyName];
    const error = {
      status: 400,
      message: `Reservation must include a valid ${propertyName}`,
    };

    if (!value || value == "" || typeof value !== "number") {
      return next(error);
    }
    next();
  };
}

function hasResTime(propertyName) {
  return async (req, res, next) => {
    const error = {
      status: 400,
      message: `Reservation must include a valid ${propertyName}`,
    };
    const { data = {} } = req.body;
    const value = data[propertyName];
    const date = data.reservation_date;
    const resDate = Date.parse(date);
    let notExists;

    if (!isNaN(resDate)) {
      const listByDate = await listRes(date);
      notExists = listByDate.every((res) => res.reservation_time !== value);
    }

    if (!value) return next(error);

    const timeSplit = value.split(":").every((sec) => sec.length === 2);

    if (value == "" || timeSplit == false || notExists == false) {
      return next(error);
    }
    next();
  };
}

function hasResDate(propertyName) {
  return (req, res, next) => {
    const error = {
      status: 400,
      message: `Reservation must include a valid ${propertyName}`,
    };
    const { data = {} } = req.body;
    const value = data[propertyName];
    const resDate = Date.parse(value);
    const weekDay = new Date(value).getDay();

    if (resDate < Date.now()) {
      return next({
        status: 400,
        message: "Reservation must be at a future date.",
      });
    }

    if (weekDay === 1) {
      return next({
        status: 400,
        message: "Restaurant is closed on tuesdays, no reservations allowed.",
      });
    }

    if (!value || value == "" || isNaN(resDate)) {
      return next(error);
    }
    next();
  };
}

const hasFirstName = bodyDataHas("first_name");
const hasLastName = bodyDataHas("last_name");
const hasPhoneNumber = bodyDataHas("mobile_number");
const hasReservationDate = hasResDate("reservation_date");
const hasReservationTime = hasResTime("reservation_time");
const hasNumOfPeople = hasPeople("people");

async function notBooked(req, res, next) {
  const { status } = req.body.data;
  const error = {
    status: 400,
    message: `Cannot create reservation with status ${status}`,
  };
  status == "booked" || status == null ? next() : next(error);
}
function statusValid(req, res, next) {
  const { status } = req.body.data;
  const error = { status: 400, message: `Status cannot be ${status}` };
  if (status == "unknown") next(error);
  next();
}

async function canUpdate(req, res, next) {
  const { reservation_id } = req.params;
  const data = await singleRes(reservation_id);
  const error = { status: 400, message: "Cannot update finished reservation" };
  if (data.status == "finished") next(error);
  next();
}

async function create(req, res) {
  const data = await addRes(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  const { date } = req.query;
  const { mobile_number } = req.query;
  const data = await listRes(date, mobile_number);
  res.json({ data });
}

async function getReservation(req, res) {
  const { reservation_id } = req.params;
  const data = await singleRes(reservation_id);
  res.json({ data, reservation_id });
}

async function updateStatus(req, res) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const data = await updateResStatus(reservation_id, status);
  res.json({ data });
}

async function updateReservation(req, res) {
  const { reservation_id } = req.params;
  const newRes = req.body.data;
  const data = await updateRes(reservation_id, newRes);
  res.json({ data });
}

module.exports = {
  list,
  get: [idValid, getReservation],
  create: [
    hasFirstName,
    hasLastName,
    hasPhoneNumber,
    hasNumOfPeople,
    hasReservationTime,
    hasReservationDate,
    notBooked,
    create,
  ],
  putStatus: [idValid, statusValid, canUpdate, updateStatus],
  putRes: [
    idValid,
    hasFirstName,
    hasLastName,
    hasPhoneNumber,
    hasNumOfPeople,
    hasReservationTime,
    hasReservationDate,
    updateReservation,
  ],
};
