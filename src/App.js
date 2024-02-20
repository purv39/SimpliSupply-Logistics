// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgetPassword from './pages/auth/ForgetPassword';
import Home from './pages/Home';
import WelcomePage from './pages/Welcome';
import AddDistributor from './pages/AddDistributor';
import { AuthContextProvider } from './firebase/firebaseAuth';
import PrivateRoutes from './components/PrivateRoutes';
import DistributorsList from './pages/distributor/DistributorsList';
import CreateNewOrder from './pages/CreateNewOrder';
import OrderHistory from './pages/OrderHistory';
import LandingPage from './pages/LandingPage'; // Import your LandingPage component


const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Landing page */}
          <Route path="/login" element={<Login />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/home" element={<PrivateRoutes><Home /></PrivateRoutes> } />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/add_distributor" element={<AddDistributor/>} />
          <Route path="/distributorlist" element={<DistributorsList/>} />

          <Route path="/home" element={<PrivateRoutes><Home /></PrivateRoutes>} />
          <Route path="/welcome" element={<PrivateRoutes><WelcomePage /></PrivateRoutes>} />
          <Route path="/adddistributor" element={<AddDistributor />} />
          <Route path="/createNewOrder" element={<CreateNewOrder />} />
          <Route path="/orderhistory" element={<OrderHistory />} />

        </Routes>
      </AuthContextProvider>
    </Router>
  );
};

export default App;
