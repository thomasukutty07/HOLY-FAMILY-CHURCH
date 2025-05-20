import Calendar from "../models/calendarModel.js";

// @desc    Get all calendar events
// @route   GET /church/calendar/events
// @access  Private
export const getEvents = async (req, res) => {
  try {
    const events = await Calendar.find().sort({ date: 1 });
    console.log('Fetched events:', events.map(event => ({
      id: event._id,
      title: event.title,
      date: event.date,
      time: event.time
    })));
    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new calendar event
// @route   POST /church/calendar/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, type } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const event = await Calendar.create({
      title,
      description,
      date,
      time,
      type: type || "general",
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a calendar event
// @route   PUT /church/calendar/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, time, type } = req.body;
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (!title || !date || !time) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const updatedEvent = await Calendar.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        date,
        time,
        type: type || event.type,
      },
      { new: true }
    );

    res.json({ success: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a calendar event
// @route   DELETE /church/calendar/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    console.log('Attempting to delete event with ID:', req.params.id);
    
    const event = await Calendar.findById(req.params.id);
    console.log('Found event:', event ? 'Yes' : 'No');

    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    await event.deleteOne();
    console.log('Event deleted successfully');
    res.json({ success: true, eventId: req.params.id });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}; 