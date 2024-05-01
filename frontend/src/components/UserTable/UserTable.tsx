import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionHistory from '../TransactionHistory/TransactionHistory';
import { Table, Modal } from 'react-bootstrap';
import './UserTable.css';

interface User {
  id: string;
  username: string;
  lastName: string;
  firstName: string;
  dob: string;
  email: string;
  phone: string;
  balance: string;
  isFrozen: boolean;
  userRole: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/all`, { withCredentials: true })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleFreezeUser = (username: string) => {
    alert('Freeze user not implemented');
    // axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/users/freeze/${username}`, { withCredentials: true })
    //   .then(response => {
    //     setUsers(users.map(user => user.username === username ? response.data : user));
    //   })
    //   .catch(error => {
    //     console.error('Error freezing user:', error);
    //   });
  };

  const handleDeleteUser = (username: string) => {
    alert('Delete user not implemented');
    // axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/delete/${username}`, { withCredentials: true })
    //   .then(() => {
    //     setUsers(users.filter(user => user.username !== username));
    //   })
    //   .catch(error => {
    //     console.error('Error deleting user:', error);
    //   });
  };

  const handleViewClick = (username: string) => {
    setSelectedUser(username);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Table striped bordered hover className="user-table">
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Username</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>DOB</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Current Balance</th>
            <th>Transaction History</th>
            <th>Frozen</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.lastName}</td>
            <td>{user.firstName}</td>
            <td>{user.dob}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.balance}</td>
            <td><button className="btn btn-primary" onClick={() => handleViewClick(user.username)}>View</button></td>
            <td><button className="btn btn-warning" onClick={() => handleFreezeUser(user.username)}>{user.isFrozen ? 'Unfreeze' : 'Freeze'}</button></td>
            <td><button className="btn btn-danger" onClick={() => handleDeleteUser(user.username)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Transaction History for {selectedUser}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TransactionHistory />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserTable;