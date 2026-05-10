import { useState } from "react";
import axios from "axios";

function MyBookings() {

  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {

    try {

      const { data } = await axios.get(
        `http://localhost:8000/api/bookings?email=${email}`
      );

      setBookings(data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h1>My Bookings</h1>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={fetchBookings}>
        Search
      </button>

      <div>

        {bookings.map((booking) => (

          <div key={booking._id}>

            <h3>{booking.expertId?.name}</h3>

            <p>{booking.date}</p>

            <p>{booking.timeSlot}</p>

            <p>Status: {booking.status}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyBookings;