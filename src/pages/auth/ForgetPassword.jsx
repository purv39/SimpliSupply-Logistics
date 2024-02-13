import React, { useState } from 'react';
import { useAuth} from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import User from '../../classes/User';
import companyLogo from '../../assets/logo.png'; // Import your company logo
import loginImage from '../../assets/loginVector.jpg'; // Import the cool-looking picture
import { Button, Steps, message } from 'antd'; // Import Button and Steps from Ant Des

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Define loading state
  const [error, setError] = useState(''); // Define error state

  const { forget } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const loginUser = new User(email, password, "retailer");

      // Use Firebase auth to sign in
      await forget(email)
      navigate('/login');
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
    <div className="login-container" style={{ display: 'flex', height: '100vh', overflow: 'auto' }}>
      <div className="login-content" style={{ display: 'flex', flex: 1 }}>
        <div className="login-image" style={{ flex: '0 0 50%', maxWidth: '50%', overflow: 'auto', marginTop: '90px' }}>
          <img src={loginImage} alt="Login" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <div className="login-form" style={{ flex: '0 0 50%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '40%', margin: '0 auto' }}> 
          <header>
            <img src={companyLogo} alt="Company Logo" className="company-logo" />
          </header>
          <h2>Forget Password</h2>
          <div className="signup-form" style={{ width: '100%' }}>
            
            <div className='form-group' style={{ width: '100%', marginBottom: '20px' }}>
              <label class="h5">Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', marginTop: '5px', fontSize: '16px', color: '#333', backgroundColor: '#fff', transition: 'border-color 0.3s' }} />
            </div>
           
            <div style={{ width: '100%' }}>
              <Button type="primary" style={{ width: '300px', height: '40px' }} onClick={handleLogin}>
                Reset Password 
              </Button>
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
