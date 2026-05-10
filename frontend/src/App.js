import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />

         <Route
            path="/bookings"
            element={<MyBookings />}
         />
      </Routes>
    </BrowserRouter>
  );
}

export default App;  