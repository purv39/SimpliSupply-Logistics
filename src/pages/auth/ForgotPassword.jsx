import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../../assets/logo1.png';
import loginImage from '../../assets/loginVector.png';
import { Button, message } from 'antd';
import { RiseLoader } from 'react-spinners';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { Forgot } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await Forgot(email);
      message.success('Reset Email Sent Successfully!!');
      navigate('/login');
    } catch (error) {
      message.error('Password reset failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto', backgroundColor: '#eaf9f5' }}>
      <div className="login-content" style={{ display: 'flex', flex: 1 }}>
        <div className="login-image" style={{ maxWidth: '100%', justifyContent: 'center', display: 'flex' }}>
          <img src={loginImage} alt="Login" />
        </div>
        <div className="login-form" style={{ flex: '0 0 50%', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '90%', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={companyLogo} alt="Company Logo" style={{ width: '100%', marginTop: '-90px' }} />
          </header>
          <div className="signup-form" style={{ width: '100%' }}>
            <h2>Forgot Password</h2>
            <div className='form-group' style={{ width: '100%', marginBottom: '20px' }}>
              <label className="h5">Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', marginTop: '5px', fontSize: '16px', color: '#333', backgroundColor: '#fff', transition: 'border-color 0.3s' }} />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button type="primary" style={{ width: '80%', height: '40px' }} onClick={handleLogin} disabled={isLoading}>
                {isLoading ? <RiseLoader color="#fff" loading={isLoading} size={10} /> : 'Reset Password'}
              </Button>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            Already have an Account? <a href="/login" style={{ textDecoration: 'none', marginLeft: '5px' }}>Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
