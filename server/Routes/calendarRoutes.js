import express from "express";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/calendarController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected and require authentication
router.use(authMiddleware);

router.route("/events")
  .get(getEvents)
  .post(createEvent);

router.route("/events/:id")
  .put(updateEvent)
  .delete(deleteEvent);

export default router; 