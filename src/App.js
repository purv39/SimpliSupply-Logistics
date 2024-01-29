// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import WelcomePage from './pages/Welcome';
import { AuthContextProvider } from './firebase/firebaseAuth';
import PrivateRoutes from './components/PrivateRoutes';

const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PrivateRoutes><Home /></PrivateRoutes> } />
          <Route path="/" element={<WelcomePage />} />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
};

export default App;
