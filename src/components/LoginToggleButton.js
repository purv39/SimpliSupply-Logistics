import React from 'react';
import "../styles/LoginToggle.css";

const LoginToggleButton = ({setRole, role}) => {

    const selectDistributor = () => {
        setRole('Distributor')
    };

    const selectStore = () => {
        setRole('Store');
    };

    return (
        <div className="button-box">
            <div id="btn" style={{ left: role === 'Store' ? '0' : '50%' }}></div>
            <button type="button" className='toggle-btn' onClick={selectStore}>
                Store Login
            </button>
            <button type="button" className='toggle-btn' onClick={selectDistributor}>
                Distributor Login
            </button>
        </div>
    )
}

export default LoginToggleButton;
