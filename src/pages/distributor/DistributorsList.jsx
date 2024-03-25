import React, { useState, useEffect } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { Checkbox, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Chip, Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavBar from '../../components/MainNavBar';
import { DisconnectDistributorStore, FetchAllDistributorsForStore, FetchPendingInvitations } from "../../firebase/firebaseFirestore";
import { RiseLoader } from 'react-spinners'; 
import "../../styles/LoadingSpinner.css";
import { Pagination } from 'antd'; // Import Pagination from Ant Design

const DistributorsList = () => {
  const { currentUser } = useAuth();
  const [connectedDistributors, setConnectedDistributors] = useState([]);
  const [pendingDistributors, setPendingDistributors] = useState([]);
  const [list, setList] = useState([]);
  const [selectedDistributors, setSelectedDistributors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
  const storeID = currentUser.selectedStore;

  const fetchConnectedDistributors = async (storeID) => {
    setLoading(true);
    const distributorData = await FetchAllDistributorsForStore(storeID);
    setConnectedDistributors(distributorData);
    setLoading(false); // Set loading to false when data is fetched
  };

  const fetchPendingDistributors = async (storeID) => {
    setLoading(true);
    const distributorData = await FetchPendingInvitations(storeID);
    setPendingDistributors(distributorData);
    setLoading(false); // Set loading to false when data is fetched
  };

  useEffect(() => {
    fetchConnectedDistributors(storeID);
    fetchPendingDistributors(storeID);
  }, [storeID]);

  useEffect(() => {
    // Combine connectedDistributors and pendingDistributors into a single list
    const combinedList = [...connectedDistributors, ...pendingDistributors];
    setList(combinedList);
  }, [connectedDistributors, pendingDistributors]);

  // Logic to get current distributors based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDistributors = list.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const onPageChange = (page) => setCurrentPage(page);

  // Handle selecting distributor
  const handleSelectDistributor = (id) => {
    setSelectedDistributors(prevSelectedDistributors => ({
      ...prevSelectedDistributors,
      [id]: !prevSelectedDistributors[id]
    }));
  };

  // Handle removing selected distributors
  const handleRemoveSelected = async () => {
    const selectedIds = Object.keys(selectedDistributors).filter(id => selectedDistributors[id]);
    if (selectedIds.length === 0) {
      alert('Please select at least one distributor to remove.');
      return;
    }
    try {
      await Promise.all(selectedIds.map(id => DisconnectDistributorStore(storeID, id)));
      setList(list.filter(distributor => !selectedIds.includes(distributor.id)));
      setSelectedDistributors({}); // Reset the selected distributors
      alert('Selected distributors have been successfully removed.');
    } catch (error) {
      console.error('Error removing selected distributors:', error);
      alert('Failed to remove selected distributors. Please try again.');
    }
  };

  return (
    <div>
      <MainNavBar />
      <h2>Distributors List</h2>
      {loading ? ( 
        <div className="loading-spinner">
          <RiseLoader color="#36D7B7" loading={loading} size={10} />
        </div>
      ) : (
        <div>
          <TableContainer component={Paper} className="tableContainer">
            <Table aria-label="distributors table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Distributor</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentDistributors?.length > 0 ? currentDistributors.map((distributor) => (
                  <TableRow key={distributor.id} selected={selectedDistributors[distributor.id]}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={!!selectedDistributors[distributor.id]}
                        onChange={() => handleSelectDistributor(distributor.id)}
                      />
                    </TableCell>
                    <TableCell>{distributor?.data?.storeName || 'Unknown Distributor'}</TableCell>
                    <TableCell align="right">
                      {pendingDistributors.find(pendingDistributor => pendingDistributor.id === distributor.id) ? (
                        <Chip label="Pending" color="warning" variant="outlined" />
                      ) : (
                        <Chip label="Connected" color="success" variant="outlined" />
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3}>No Distributors found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={list.length}
              onChange={onPageChange}
              showQuickJumper
            />
          </div>
          <div className="removeButtonContainer">
            <Button variant="contained" color="error" onClick={handleRemoveSelected}>
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorsList;
