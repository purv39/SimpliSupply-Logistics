import React from 'react';
import "../styles/Signup.css";

const SetupAccount = ({
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    setRole,
}) => {
    return (
        <div>
            <div className="form-group">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Confirm Password:</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="form-group radio-group">
                <label>User Type:</label>
                <div className='radio-inputs' >
                    <label>
                        <input
                            type="radio"
                            value="store"
                            checked={role === "store"}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        Store
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="distributor"
                            checked={role === "distributor"}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        Distributor
                    </label>
                </div>
            </div>
        </div>
    );
}

export default SetupAccount;
