import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/flights" element={<div className="p-8 text-2xl font-bold">Flights — coming soon</div>} />
<Route path="/car-rental" element={<div className="p-8 text-2xl font-bold">Car Rental — coming soon</div>} />
<Route path="/attractions" element={<div className="p-8 text-2xl font-bold">Attractions — coming soon</div>} />
<Route path="/airport-taxis" element={<div className="p-8 text-2xl font-bold">Airport Taxis — coming soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;