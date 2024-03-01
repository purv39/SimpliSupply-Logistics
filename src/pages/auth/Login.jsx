import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../../assets/logo1.png'; // Import your company logo
import loginImage from '../../assets/loginVector.png'; // Import the cool-looking picture
import { Button } from 'antd'; // Import Button and Steps from Ant Design
import LoginToggleButton from '../../components/LoginToggleButton';
import { message } from 'antd';
import '../../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Store');

  const { Login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      // Use Firebase auth to sign in
      await Login(email, password, role);
      if(role === 'Store') {
        navigate('/StoreHome');
      } else {
        navigate('/DistributorHome')
      }
      // Redirect or handle successful login
    } catch (error) {
      // Handle login error
      message.error('Login failed: ' + error.message);
    } finally {
    }
  };

  return (
    <div className="login-container">
      <div className="login-content" >
        <div className="login-image" >
          <img src={loginImage} alt="Login" />
        </div>
        <div className="login-form" >
          <header >
            <img src={companyLogo} alt="Company Logo" />
          </header>
          <div className="signup-form">
            <h2>Login</h2>
            <LoginToggleButton setRole={setRole} role={role} />
            <div className='form-group' >
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='form-group'>
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='forgot-password'>
              <a href="/Forgot">Forgot Password?</a>
            </div>
            <div >
              <Button type="primary" className='login-button' onClick={handleLogin}>
                Login
              </Button>
            </div>
          </div>
          <div className='register-link' >
            Don't have an Account?
            <a href="/Signup"> Register Now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
