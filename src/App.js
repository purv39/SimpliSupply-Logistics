// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
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
import Invitations from './pages/Invitations';
import ShipmentHistory from './pages/ShipmentHistory';
import DistributorPrivateRoute from './components/DistributorPrivateRoute';
import StoreHome from './pages/StoreHome';
import DistributorHome from './pages/DistributorHome';
import AddStore from "./pages/AddStore";
import CompareProducts from './pages/CompareProducts';

const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Landing page */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Forgot" element={<ForgotPassword />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<PageNotFound />  } />
          
          <Route path="/StoreHome" element={<StoreOperatorPrivateRoute><StoreHome /></StoreOperatorPrivateRoute> } />
          <Route path="/Welcome" element={<PrivateRoutes><WelcomePage /></PrivateRoutes> } />
          
          <Route path="/DistributorList" element={<StoreOperatorPrivateRoute><DistributorsList/></StoreOperatorPrivateRoute>} />
          <Route path="/AddDistributor" element={<StoreOperatorPrivateRoute><AddDistributor /></StoreOperatorPrivateRoute>} />
          <Route path="/CreateNewOrder/:distributorID?" element={<StoreOperatorPrivateRoute><CreateNewOrder /></StoreOperatorPrivateRoute> } />
          <Route path="/OrderHistory" element={<StoreOperatorPrivateRoute><OrderHistory /></StoreOperatorPrivateRoute> } />
          <Route path="/Addstore" element={<StoreOperatorPrivateRoute><AddStore /></StoreOperatorPrivateRoute> } />
          <Route path="/CompareProducts" element={<StoreOperatorPrivateRoute><CompareProducts /></StoreOperatorPrivateRoute> } />

          <Route path="/DistributorHome" element={<DistributorPrivateRoute><DistributorHome /></DistributorPrivateRoute> } />
          <Route path="/AddProducts" element={<DistributorPrivateRoute><AddProducts /></DistributorPrivateRoute>} />
          <Route path="/DistributorHome" element={<DistributorPrivateRoute><DistributorHome /></DistributorPrivateRoute> } />
          <Route path="/Invitations" element={<DistributorPrivateRoute><Invitations /></DistributorPrivateRoute>} />
          <Route path="/ShipmentHistory" element={<DistributorPrivateRoute><ShipmentHistory /></DistributorPrivateRoute>} />
          <Route path="/AddDistributionStore" element={<DistributorPrivateRoute><AddStore /></DistributorPrivateRoute>} />
          
        </Routes>
      </AuthContextProvider>
    </Router>
  );
};

export default App;
