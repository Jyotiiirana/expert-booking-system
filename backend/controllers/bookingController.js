const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    const io = req.app.get("io");

    io.emit("slotBooked", booking);

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This slot is already booked",
      });
    }

    res.status(500).json({
      message: "Booking failed",
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const email = req.query.email;

    const bookings = await Booking.find({ email }).populate(
      "expertId",
      "name category"
    );

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = req.body.status;

    await booking.save();

    res.json({
      message: "Status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking",
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};