import express from "express";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/calendarController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public route for getting events
router.get("/events", getEvents);

// Protected routes for managing events
router.use(authMiddleware);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

export default router; 