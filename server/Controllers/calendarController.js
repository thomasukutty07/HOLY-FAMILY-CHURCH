import Calendar from "../models/calendarModel.js";

// @desc    Get all calendar events
// @route   GET /church/calendar/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    console.log('Fetching events from database...');
    const events = await Calendar.find().sort({ date: 1 });
    
    console.log('Found events:', events.length);
    console.log('Events data:', events.map(event => ({
      id: event._id,
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type
    })));

    res.json({ success: true, events });
  } catch (error) {
    console.error('Error in getEvents controller:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    await event.deleteOne();
    res.json({ success: true, eventId: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 