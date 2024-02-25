import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/firebaseAuth';

const MainNavBar = () => {
    const navigate = useNavigate();
    const { LogOut } = useAuth();

    const navigateTo = (path) => {
        navigate(path);
    };

    const handleLogout = async () => {
        try {
          await LogOut();
          navigate('/');
          console.log("Logged out successfully");
        } catch (error) {
          console.error('Logout failed:', error.message);
        }
      };

    return (<div className="navbar">
        <div className="logo">SimpliSupply Logistics</div>
        <nav>
            <ul>
                <li><button className="nav-button" onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/OrderHistory')}>Order History</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/DistributorList')}>Distributor List</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button></li>
            </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>)
}

export default MainNavBar;