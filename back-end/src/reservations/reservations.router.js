/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  
  router
  .route("/:reservation_id")
  .get(controller.get)
  
  router  
  .route("/:reservation_id/status")
  .put(controller.putStatus)

module.exports = router;
