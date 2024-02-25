import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../../assets/logo1.png'; // Import your company logo
import loginImage from '../../assets/loginVector.png'; // Import the cool-looking picture
import { Button, Steps, message } from 'antd'; // Import Button and Steps from Ant Des

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const { forget } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Use Firebase auth to sign in
      await forget(email)
      navigate('/login');
      // Redirect or handle successful login
    } catch (error) {
      // Handle login error
      message.error('Login failed: ' + error.message);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', height: '100vh', overflow: 'auto', backgroundColor: '#eaf9f5' }}>
      <div className="login-content" style={{ display: 'flex', flex: 1 }}>
        <div className="login-image" style={{ flex: '0 0 50%', maxWidth: '50%', justifyContent: 'center', display: 'flex' }}>
        <img src={loginImage} alt="Login" style={{ width: "170%", marginTop: '8%', marginLeft: '10%'}} />
        </div>
        <div className="login-form" style={{ flex: '0 0 50%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '40%', margin: '0 auto' }}>
          <header>
            <img src={companyLogo} alt="Company Logo" style={{ width: '100%', marginTop: '-90px' }} />
          </header>
          <div className="signup-form" style={{ width: '100%' }}>
            <h2>Forgot Password</h2>

            <div className='form-group' style={{ width: '100%', marginBottom: '20px' }}>
              <label class="h5">Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', marginTop: '5px', fontSize: '16px', color: '#333', backgroundColor: '#fff', transition: 'border-color 0.3s' }} />
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'left' }}>
              <Button type="primary" style={{ width: '300px', height: '40px' }} onClick={handleLogin}>
                Reset Password
              </Button>
            </div>

          </div>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            Already have an Account?
            <a href="/login" style={{ textDecoration: 'none', marginLeft: '5px' }}>Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
