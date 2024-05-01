import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import './Profile.css';

const Profile: React.FC = () => {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getUserByUsername = async () => {
      let currentUser = localStorage.getItem("username");
      try {
        const response = await axios.get(`http://localhost:8080/api/users/username/${currentUser}`, {
          withCredentials: true
        });
        setUserData(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      } catch (error) {
        console.log(error);
      }
    };

    getUserByUsername();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 const handleLogOut = async () => {
  try {
    // Make a request to the logout endpoint
    await axios.post(`http://localhost:8080/api/users/logout`,
    {
      username:userData.username,
      password:userData.password
    },
    {
      withCredentials: true
    });
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  } catch (error) {
    console.error('Error logging out:', error);
  
  }
};

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    if (input.length > 3) {
      input = input.slice(0, 3) + '-' + input.slice(3);
    }
    if (input.length > 7) {
      input = input.slice(0, 7) + '-' + input.slice(7);
    }
    setPhone(input);
  };

  const handleUpdate = () => {
    const updatedFields: { username?: string; email?: string; phone?: string; } = {};
    if (username && username.length > 0) updatedFields.username = username;
    if (email && email.length > 0) updatedFields.email = email;
    if (phone && phone.length >0) updatedFields.phone = phone;

    axios.patch(`http://localhost:8080/api/users/update`, updatedFields, {
      withCredentials: true
    })
    .then((response) => {
      console.log(response);
      handleClose();
    })
    .catch((err) => {
      console.error('Error updating user: ', err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      }
    });
  }

  return (
    <div className="profile-box mt-5 mb-5">
      <Card style={{ width: '44rem' }}>
        <Card.Body>
          <Card.Title>Hello {userData?.username}!</Card.Title>
          <Card.Text>
            Username: {userData?.username}<br/>
            Email: {userData?.email}<br/>
            Phone: {userData?.phone}<br/>
            
          </Card.Text>
          <Button className='update-btn btn btn-primary' variant="primary" onClick={handleShow}>
            Update Information
          </Button><br />

          <div onClick={handleLogOut} className='mt-5 btn btn-warning'>Log out</div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                name="phone"
                placeholder='###-###-####'
                value={phone}
                onChange={handlePhoneChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Confirm Updates
          </Button>
        </Modal.Footer>
        {error && <p>{error}</p>}
      </Modal>
    </div>
  );
}

export default Profile;
