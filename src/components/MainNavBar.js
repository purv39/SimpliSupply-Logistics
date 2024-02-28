import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/firebaseAuth';

const MainNavBar = () => {
  const navigate = useNavigate();
  const { LogOut, currentUser } = useAuth();
  const role = currentUser.currentRole;

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
    <div className="logo" onClick={() => navigateTo('/home')}>SimpliSupply Logistics</div>
    <nav>
      <ul>
        {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button></li>}
        {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button></li>}
        {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/DistributorList')}>Distributor List</button></li>}
        {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/OrderHistory')}>Order History</button></li>}
      </ul>
    </nav>
    <button className="logout-button" onClick={handleLogout}>Logout</button>
  </div>)
}

export default MainNavBar;