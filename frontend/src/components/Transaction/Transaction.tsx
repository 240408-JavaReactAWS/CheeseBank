import React, { useState } from 'react';
import axios from 'axios';
import { Form, InputGroup, ToggleButton, ToggleButtonGroup, Button } from 'react-bootstrap';

const Transaction: React.FC = () => {
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [error, setError] = useState('');

  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value);
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    let numericInput = input.replace(/\D/g, '');
    let paddedInput = numericInput.padStart(3, '0');
    let dollarAmount = `${paddedInput.slice(0, -2)}.${paddedInput.slice(-2)}`;
    let dollarAmountWithoutLeadingZeros = dollarAmount === '' ? '' : parseFloat(dollarAmount).toFixed(2);
    setAmount(dollarAmountWithoutLeadingZeros);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    let numericInput = input.replace(/\D/g, '');
    setTargetAccount(numericInput);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount === '') {
      setError('Amount is required!');
      return;
    }

    let dataToSend: { amount: string; description?: string; targetAccount?: string } = {
      amount,
      description
    };

    if (transactionType === 'transfer') {
      if (targetAccount === '') {
        setError('Recipient account is required!');
        return;
      }
      dataToSend.targetAccount = targetAccount;
    }
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/transactions/${transactionType}`, dataToSend, { withCredentials: true })
    .then(response => {
      console.log("Transaction successful!");
      setAmount('');
      setDescription('');
      setTargetAccount('');
      setError('Transaction successful!');
      setTimeout(() => {
        setError('');
      }, 600);
    })
    .catch(err => {
      setError(err.response.data);
    });
  }

  return (
    <section className="transaction-body">
      <ToggleButtonGroup type="radio" name="transaction-type" defaultValue={transactionType} onChange={handleTransactionTypeChange}>
        <ToggleButton id="toggle-deposit" value="deposit">Deposit</ToggleButton>
        <ToggleButton id="toggle-withdrawal" value="withdrawal">Withdraw</ToggleButton>
        <ToggleButton id="toggle-transfer" value="transfer">Transfer</ToggleButton>
      </ToggleButtonGroup>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formAmount">
          <Form.Label>Amount </Form.Label>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control type="text" value={amount} onChange={handleAmountChange} placeholder="0.00" />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" value={description} onChange={handleDescriptionChange} placeholder="Optional" />
        </Form.Group>
        {transactionType === 'transfer' && (
          <Form.Group controlId="formRecipientAccount">
            <Form.Label>Recipient</Form.Label>
            <Form.Control type="text" value={targetAccount} onChange={handleRecipientChange} placeholder="Account Number" />
          </Form.Group>
        )}
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <p className="recipient-error">{error}</p>
      </Form>
    </section>
  );
}

export default Transaction;