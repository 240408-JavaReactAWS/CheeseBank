import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { User } from '../../models/User';
import './Transaction.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaGift, FaPlane } from 'react-icons/fa';


function Transaction({ updateTransactionHistory }: { updateTransactionHistory: () => void }) {
    const [showDepositInfo, setShowDepositInfo] = useState(false);
    const [showWithdrawInfo, setShowWithdrawInfo] = useState(false);
    const [showTransferInfo, setShowTransferInfo] = useState(false);
    const [emailTo, setEmailTo] = useState("");
    const [amount, setAmount] = useState(BigInt(0));
    const [transactionType, setTransactionType] = useState("");
    const [description, setDescription] = useState("");
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const getUserByUsername = async () => {

            let currentUser = localStorage.getItem("username");
            try {
                const response = await axios.get(`http://localhost:8080/api/users/username/${currentUser}`,{
                    withCredentials: true
                
                });
                setUser(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getUserByUsername();
    }, []);

    const handleDepositClick = () => {
        setShowDepositInfo(true);
        setShowWithdrawInfo(false);
        setShowTransferInfo(false);
        setTransactionType("DEPOSIT");
    };

    const handleWithdrawClick = () => {
        setShowWithdrawInfo(true);
        setShowTransferInfo(false);
        setShowDepositInfo(false);
        setTransactionType("WITHDRAWAL");
    };

    const handleTransferClick = () => {
        setShowTransferInfo(true);
        setShowDepositInfo(false);
        setShowWithdrawInfo(false);
        setTransactionType("TRANSFER");
    };

    const handleAmountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(BigInt(event.target.value));
    };

    const handleDescriptionInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleEmailFromInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailTo(event.target.value);
    };

    const submitTransaction = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/transactions/${transactionType.toLowerCase()}`, {
                amount: amount.toString(),
                description: description,
            }, {
                withCredentials: true
            });
            if (response.status === 201) {
                alert("Transaction successful!");
                updateTransactionHistory();
            } else {
                console.log(user);
                alert("Transaction unsuccessful. Please try again.");
            }
        } catch (error) {
            console.log(error);
            alert("Transaction unsuccessful. Please try again.");
        } finally {
            setAmount(BigInt(0));
            setDescription("");
        }
    };

    const submitTransfer = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/transactions/transfer/${emailTo}`, {
                amount: amount.toString(),
                description: description
            }, {
                withCredentials: true
            });
            if (response.status === 200 || response.status === 201) {
                alert("Transaction successful!");
                // Call the function to update transaction history
                updateTransactionHistory();
            } else {
                alert("Transaction unsuccessful. Please try again.");
            }
        } catch (error) {
            console.log(error);
            alert("Transaction unsuccessful. Please try again.");
        } finally {
            setEmailTo("");
            setAmount(BigInt(0));
            setDescription("");
        }
    };


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-3 balance-container mt-3 pt-2'>
                    <div className='balance-inner-container'>
                        <h4>Checking Account <em>(00{user?.id})</em> </h4>
                        <h3>$ {user?.balance}</h3>
                        <p className=''>Available Balance</p>
                    </div>
                     <div className='creditcard-container'>
                        <h4>Credit Cards</h4>

                        <div>
                            <p>Visa(5645)</p>
                        </div>

                        <h3>$302.45</h3>
                        <p className=''>Current Balance</p>
                            <button className='btn btn-primary'>pay now</button>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='transaction-body'>
                        <div className='transaction-btn'>
                            <button className='btn btn-success mr-2' onClick={handleDepositClick}>Deposit</button>
                            <button className='btn btn-danger mr-2' onClick={handleWithdrawClick}>Withdraw</button>
                            <button className='btn btn-primary' onClick={handleTransferClick}>Transfer</button>
                        </div>
                        <div className='input-container'>
                            {showTransferInfo && (
                                <input type='text' value={emailTo} onChange={handleEmailFromInput} className='form-control  mt-2' placeholder='Transfer To' />
                            )}
                            <input type='number' value={amount.toString()} onChange={handleAmountInput} className='form-control mt-2' placeholder='Amount' />
                            <input type='text' value={description} onChange={handleDescriptionInput} className='form-control mt-2' placeholder='Description' />
                        </div>
                        <div className='btn-body'>
                            {showDepositInfo && (
                                <button className='btn btn-success mt-3' onClick={submitTransaction}>Confirm Deposit</button>
                            )}
                            {showWithdrawInfo && (
                                <button className='btn btn-danger mt-3' onClick={submitTransaction}>Confirm Withdraw</button>
                            )}
                            {showTransferInfo && (
                                <button className='btn btn-primary mt-3' onClick={submitTransfer}>Confirm Transfer</button>
                            )}
                        </div>
                        
                    </div>
                </div>

               <div className='col-lg-3 pt-3'>
                    <div className='reward-container '>
                        <h4 className=''>Rewards <FaGift /></h4>
                        <p>322,000 points</p>
                        <p>Ultimate Rewards points</p>
                        <button className='btn'>Redeem</button>
                    </div>

                    <div className='travel-container mt-2'>
                        <h4>Travel <FaPlane /></h4> 
                        <p>Explore adventures around the world</p>
                    </div>
</div>
       
                
            </div>
            
        </div>
    );
}

export default Transaction;
