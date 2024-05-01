import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FaGift, FaPlane } from 'react-icons/fa';
import { useSession } from '../../context/SessionContext';
import axios from 'axios';

function Balance() {
  const { sessionUser, login } = useSession();
  const userId = sessionUser?.id;
  const balance = sessionUser?.balance;
  const isFrozen = sessionUser?.isFrozen;
  const randomDollarAmount = (Math.random() * 5000).toFixed(2);
  const randomPoints = Math.floor(Math.random() * 1000000).toLocaleString();

  const onFreezeHandler = () => {
    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/users/freeze`, sessionUser, {
      withCredentials: true
    })
    .then((response) => {
      console.log(response);
      if (response.data) {
        login(response.data); // Update the session user with the new data
      }
    })
    .catch((error) => {
      console.error('Error freezing account:', error);
    });
  }

  return (
    <Container>
      <Row>
        <Col lg={3} className='mt-3 pt-2'>
          <Card>
            <Card.Body>
              <Card.Title>Checking Account <em>({userId})</em></Card.Title>
              <Card.Text>${balance}</Card.Text>
              <Card.Subtitle className='mb-2 text-muted'>Available Balance</Card.Subtitle>
            </Card.Body>
            <Card.Body>
              <Card.Title>Credit Cards</Card.Title>
              <Card.Text>Visa(5645)</Card.Text>
              <Card.Text>${randomDollarAmount}</Card.Text>
              <Card.Subtitle className='mb-2 text-muted'>Current Balance</Card.Subtitle>
              <Button variant='primary'>Pay Now</Button>
              <Form.Check
                type='switch'
                id='freeze-switch'
                label={`${isFrozen ? 'Unfreeze' : 'Freeze'} Account`}
                checked={isFrozen}
                onChange={onFreezeHandler}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} className='mt-3 pt-2'>
          <Card>
            <Card.Body>
              <Card.Title>Rewards <FaGift /></Card.Title>
              <Card.Text>{randomPoints} points</Card.Text>
              <Card.Subtitle className='mb-2 text-muted'>Ultimate Rewards points</Card.Subtitle>
              <Button variant='primary'>Redeem</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} className='mt-3 pt-2'>
          <Card>
            <Card.Body>
              <Card.Title>Travel <FaPlane /></Card.Title>
              <Card.Link href='#'>Explore adventures around the world</Card.Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Balance;