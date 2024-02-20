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
import CreateNewOrder from './pages/CreateNewOrder';
import OrderHistory from './pages/OrderHistory';


const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PrivateRoutes><Home /></PrivateRoutes> } />
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
