import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import './App.css';
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

//Toast Config
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Aboutus from "./pages/aboutUs/Aboutus";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ViewProperty from "./pages/homepage/view_property/ViewProperty";
import Landingpage from "./pages/landing/Landingpage";
import UpdateProperty from "./pages/update_property/UpdateProperty";
import UserProfile from "./pages/user/UserProfile";
import Wishlist from "./pages/wishlist/Wishlist";
import AdminRoutes from "./protected_routes/AdminRoutes"
import Footer from "./components/Footer";
import Termscondition from "./pages/terms_condition/Termscondition";
import ForgotPassword from "./pages/forgot_password/ForgotPassword";
import SwitchNavbar from "./components/SwitchNavbar";
import BookingList from "./pages/admin/Booking list/BookingList";

import MyBookings from "./pages/userBooking/MyBookings";
import ContactUs from "./pages/contactUs/ContactUs";
import ViewContact from "./pages/admin/view_contact/ViewContact";

function App() {
  return (
    <Router>
      
      <SwitchNavbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Landingpage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about/us' element={<Aboutus />} />
        <Route path='/homepage' element={<Homepage />} />

        {/*Admin routes*/}
        <Route element={<AdminRoutes />}>
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/dashboard/update/:id' element={<UpdateProperty />} />
          <Route path = '/admin/booking_list' element={<BookingList/>}></Route>
          <Route path="/admin/view_contact" element={<ViewContact/>}/>
        </Route>

        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/homepage/view/:id" element={<ViewProperty />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/terms_condition" element={<Termscondition/>}/>
        <Route path="/forgot_password" element={<ForgotPassword/>}/>
        {/* <Route path="/khalti" element={<khalti/>}/> */}
        <Route path="/contact_us" element={<ContactUs/>}/>
        <Route path="/my_bookings" element={<MyBookings />} />

      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
