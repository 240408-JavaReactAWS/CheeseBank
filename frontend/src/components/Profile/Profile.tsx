import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useSession } from '../../context/SessionContext';
import './Profile.css';

const Profile: React.FC = () => {
  const { sessionUser, login } = useSession();
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState(sessionUser?.username || '');
  const [email, setEmail] = useState(sessionUser?.email || '');
  const [phone, setPhone] = useState(sessionUser?.phone || '');
  const [error, setError] = useState('');

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setUsername('');
    setEmail('');
    setPhone('');
    setShow(true);
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

    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/users/update`, updatedFields, {
      withCredentials: true
    })
    .then((response) => {
      console.log(response);
      if (response.data) {
        login(response.data);
        handleClose();
      }
    })
    .catch((err) => {
      console.log('Error updating user: ', err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      }
    });
  }

  return (
    <div className="profile-box">
      <Card className="profile-card" style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title>Hello {sessionUser?.firstName}!</Card.Title>
          <Card.Text>
            {sessionUser?.username}<br/>
            {sessionUser?.email}<br/>
            {sessionUser?.phone}
          </Card.Text>
          <Button variant="primary" onClick={handleShow}>
            Update Information
          </Button>
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