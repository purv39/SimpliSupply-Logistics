import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../../assets/logo1.png'; // Import your company logo
import loginImage from '../../assets/loginVector.png'; // Import the cool-looking picture
import { Button } from 'antd'; // Import Button and Steps from Ant Design
import LoginToggleButton from '../../components/LoginToggleButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Define loading state
  const [error, setError] = useState(''); // Define error state

  const { Login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Use Firebase auth to sign in
      await Login(email, password);
      navigate('/home');
      // Redirect or handle successful login
    } catch (error) {
      // Handle login error
      setError(error.message);
      console.error('Login failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', height: '100vh', overflow: 'auto', backgroundColor: '#eaf9f5' }}>
      <div className="login-content" style={{ display: 'flex', flex: 1 }}>
        <div className="login-image" style={{ flex: '0 0 50%', maxWidth: '50%', justifyContent: 'center', display: 'flex' }}>
          <img src={loginImage} alt="Login" style={{ width: "170%", marginTop: '8%', marginLeft: '10%'}} />
        </div>
        <div className="login-form" style={{ flex: '0 0 50%', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '40%', margin: '50px auto auto auto' }}>
          <header style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={companyLogo} alt="Company Logo" style={{ width: '100%', marginTop: '-70px' }} />
          </header>
          <div className="signup-form" style={{ width: '100%' }}>

            <h2>Login</h2>
          <LoginToggleButton />

            <div className='form-group' style={{ width: '100%', marginBottom: '20px' }}>
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', marginTop: '5px', fontSize: '16px', color: '#333', backgroundColor: '#fff', transition: 'border-color 0.3s' }} />
            </div>
            <div className='form-group' style={{ width: '100%', marginBottom: '20px' }}>
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', marginTop: '5px', fontSize: '16px', color: '#333', backgroundColor: '#fff', transition: 'border-color 0.3s' }} />
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'right' }}>
              <a href="/forget" style={{ textDecoration: 'none', marginRight: '5px' }}>Forgot Password</a>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Button type="primary" style={{ width: '200px', height: '50px', borderRadius: '10px' }} onClick={handleLogin}>
                Login
              </Button>
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </div>

          </div>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'left', marginTop: '20px'}}>
             Don't have an Account?
            <a href="/signup" style={{ textDecoration: 'none',  marginLeft: '5px' }}> Register Now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
