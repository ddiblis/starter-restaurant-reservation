/**
 * List handler for reservation resources
 */
const { listRes, singleRes } = require("./reservations.services")

async function list(req, res) {
  const data = await listRes()
  res.json({ data });
}

async function get(req, res){
  const { reservationId } = req.params
  const data = await singleRes(reservationId)
  res.json({ data })
}

module.exports = {
  list,
  get,
};
