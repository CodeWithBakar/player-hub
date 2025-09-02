const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
} = require("../controllers/eventController");

router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);

module.exports = router;
