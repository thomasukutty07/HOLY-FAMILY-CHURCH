import express from "express";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/calendarController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public route for viewing events
router.get("/events", getEvents);

// Protected routes for managing events
router.use(authMiddleware);
router.post("/events", createEvent);
router.route("/events/:id")
  .put(updateEvent)
  .delete(deleteEvent);

export default router; 