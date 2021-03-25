/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)

router  
  .route("/:table_id")
  .get(controller.get)

router
  .route("/:table_id/seat")
  .put(controller.putSeat)
  .delete(controller.remove)

module.exports = router