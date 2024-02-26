import React, { useState } from 'react';
import "../styles/LoginToggle.css";

const LoginToggleButton = () => {
    const [activeButton, setActiveButton] = useState('store');

    const moveRegister = () => {
        setActiveButton('distributor');
    };

    const moveLogin = () => {
        setActiveButton('store');
    };

    return (
        <div className="button-box">
            <div id="btn" style={{ left: activeButton === 'store' ? '0' : '50%' }}></div>
            <button type="button" className='toggle-btn' onClick={moveLogin}>
                Store Login
            </button>
            <button type="button" className='toggle-btn' onClick={moveRegister}>
                Distributor Login
            </button>
        </div>
    )
}

export default LoginToggleButton;
