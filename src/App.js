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
import PageNotFound from './pages/PageNotFound';
import StoreOperatorPrivateRoute from './components/StoreOperatorPrivateRoute';
import AddProducts from './pages/AddProducts'; // Import the AddProducts component
import DistributorPrivateRoute from './components/DistributorPrivateRoute';

const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Landing page */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Forget" element={<ForgetPassword />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<PageNotFound />  } />
          
          <Route path="/Home" element={<PrivateRoutes><Home /></PrivateRoutes> } />
          <Route path="/Welcome" element={<PrivateRoutes><WelcomePage /></PrivateRoutes> } />
          
          <Route path="/DistributorList" element={<StoreOperatorPrivateRoute><DistributorsList/></StoreOperatorPrivateRoute>} />
          <Route path="/AddDistributor" element={<StoreOperatorPrivateRoute><AddDistributor /></StoreOperatorPrivateRoute>} />
          <Route path="/CreateNewOrder" element={<StoreOperatorPrivateRoute><CreateNewOrder /></StoreOperatorPrivateRoute> } />
          <Route path="/OrderHistory" element={<StoreOperatorPrivateRoute><OrderHistory /></StoreOperatorPrivateRoute> } />
          <Route path="/AddProducts" element={<DistributorPrivateRoute><AddProducts /></DistributorPrivateRoute>} />
          
        </Routes>
      </AuthContextProvider>
    </Router>
  );
};

export default App;
