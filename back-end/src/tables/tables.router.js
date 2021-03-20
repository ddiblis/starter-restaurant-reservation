/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router
  .route("/")
  .get(controller.list)
  // .post(con)

router  
  .route("/:table_id")
  .get(controller.get)


module.exports = router