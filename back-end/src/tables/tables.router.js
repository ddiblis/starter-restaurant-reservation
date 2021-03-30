/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./tables.controller");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed)

router  
  .route("/:table_id")
  .get(controller.get)
  .all(methodNotAllowed)

router
  .route("/:table_id/seat")
  .put(controller.putSeat)
  .delete(controller.remove)
  .all(methodNotAllowed)

module.exports = router