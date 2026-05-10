import { FaMoon, FaSun, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import "../styles/home.css";

function Home() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const socket = io("http://localhost:8000");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");

  const fetchExperts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/experts?search=${search}&category=${category}`
      );

      setExperts(data.experts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExperts();
    socket.on("slotBooked", () => {
      fetchExperts();
    });

    return () => {
      socket.off("slotBooked");
    };

  }, [search, category]);

  const handleBooking = async () => {

  try {

    await axios.post(
      "http://localhost:8000/api/bookings",
      {
        expertId: selectedExpert._id,
        name,
        email,
        phone,
        date,
        timeSlot,
        notes
      }
    );

    alert("Booking Successful");

    setSelectedExpert(null);

    setName("");
    setEmail("");
    setPhone("");
    setDate("");
    setTimeSlot("");
    setNotes("");

  } catch (error) {

    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Booking failed");
    }

  }

};
     

  return (
    <div className={darkMode ? "home dark" : "home light"}>
      <h1>Find Your Expert</h1>
      <p className="subtitle">
  Book 1:1 sessions with top professionals.
</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search expert..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Career Coach">Career Coach</option>
          <option value="Fitness Trainer">Fitness Trainer</option>
          <option value="Therapist">Therapist</option>
        </select>
      </div>
      <div className="navbar">

  <h2 className="logo">ExpertBook</h2>

  <button
    className="theme-btn"
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? <FaSun /> : <FaMoon />}
  </button>

</div>

      <div className="expert-grid">
        {experts.map((expert) => (
          <div className="expert-card" key={expert._id}>
            <h2>{expert.name}</h2>

            <p>{expert.category}</p>

            <p>{expert.experience} Years Experience</p>

            <p className="rating"><FaStar /> {expert.rating}</p>

            <p>{expert.bio}</p>

            
            <button
  onClick={() => setSelectedExpert(expert)}
>
  Book Session
</button>
          </div>
        ))}
      </div>
      {selectedExpert && (
  <div className="booking-popup">
    <div className="popup-content">

      <h2>Book Session</h2>

      <p>{selectedExpert.name}</p>

      <input
  type="text"
  placeholder="Your Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

      <input
  type="email"
  placeholder="Your Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
      <input
  type="text"
  placeholder="Phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>

<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>

<select
  value={timeSlot}
  onChange={(e) => setTimeSlot(e.target.value)}
>
  <option value="">Select Slot</option>

  <option value="10:00 AM">10:00 AM</option>

  <option value="11:00 AM">11:00 AM</option>

  <option value="2:00 PM">2:00 PM</option>
</select>

<textarea
  placeholder="Notes"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>

      <button   className="book-btn"
  onClick={() => handleBooking(expert)}
>
  Confirm Booking
</button>

      <button onClick={() => setSelectedExpert(null)}>
        Close
      </button>

    </div>
  </div>
)}
    </div>
  );
}

export default Home;