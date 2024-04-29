
import axios from 'axios';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { User } from '../../models/User';
import './Transaction.css';


function Transaction() {

    const[showDepositInfo, setShowDepositInfo] = useState(false);
    const[showWithdrawInfo, setShowWithdrawInfo] = useState(false);
    const[showTransferInfo, setShowTransferInfo] = useState(false);
    const[emailTo, setEmailTo] = useState("");
    const[amount, setAmount] = useState(BigInt(0));
    const[transactionType, setTransactionType] = useState("");
    const[description, setDescription] = useState("");
    const[user,setUser] =useState<User>()



    useEffect(() => {
        
    const getUserByUsername = async() => {
        let currentUser =localStorage.getItem("username");
        await axios.get(`http://localhost:8080/api/users/username/${currentUser}`)
        .then((response) => {
            let data = response.data;
            setUser(data);
            console.log(data)
        }).catch((error) => {
            console.log(error)
        })
    }
    getUserByUsername();


    },[]);

   

    const handleDepositClick = () => {
        setShowDepositInfo(true);
        setShowWithdrawInfo(false);
        setShowTransferInfo(false);
        setTransactionType("DEPOSIT")
    };

      const handleWithdrawClick = () => {
        setShowWithdrawInfo(true);
        setShowTransferInfo(false);
        setShowDepositInfo(false);
        setTransactionType("WITHDRAWAL")
     }

     const handleTransferClick = () => {
        setShowTransferInfo(true);
        setShowDepositInfo(false);
        setShowWithdrawInfo(false);
        setTransactionType("TRANSFER")
     }

    const handleAmountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(BigInt(event.target.value));
     }

     const handleDescriptionInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
     }

     const handleEmailFromInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailTo(event.target.value)
     
     }



let submitTransaction = async() => {
    try {
        const response = await axios.post(`http://localhost:8080/api/transactions/${transactionType.toLowerCase()}`,{
            amount: amount,
            description: description

        }, {
            withCredentials: true
        
        }); 
        console.log(response.data);
        // Check if the response indicates success
        if (response.status === 200) {
            // Show success alert
            alert("Transaction successful!");
        } else {
            // Show error alert
            alert("Transaction unsuccessful. Please try again.");
        }
    } catch (error) {
        console.log(error);
        alert("Transaction unsuccessful. Please try again.");
    } finally {
        // Reset input fields
        setAmount(BigInt(0));
        setDescription("");
    }
}

let submitTranfer = async() => {
    try {
        const response = await axios.post(`http://localhost:8080/api/v1/user/transfer?amount=${amount}&emailFrom=${user?.email}&emailTo=${emailTo}&description=${description}`);
        console.log(response.data);
        // Check if the response indicates success
        if (response.status === 200) {
            // Show success alert
            alert("Transaction successful!");
        } else {
            // Show error alert
            alert("Transaction unsuccessful. Please try again.");
        }
    } catch (error) {
        console.log(error);
        alert("Transaction unsuccessful. Please try again.");
    } finally {
        // Reset input fields
        setEmailTo("");
        setAmount(BigInt(0));
        setDescription("");
    }
}


    

  return (
    <>
    <section className='transaction-body'>
        <div className='transaction-btn' >
      
            <button className='depositTransaction' onClick={handleDepositClick}>Deposit</button>
            <button className='withdrawalTransaction' onClick={handleWithdrawClick}>Withdraw</button>
            <button className='transferTransaction' onClick={handleTransferClick}>Transfer</button>

        <div>
              {
                showTransferInfo && (
                    <input type='text' value={emailTo} onChange={handleEmailFromInput} placeholder='Transfer To'/>
                )
            }
            <input type='number' value={amount.toString()} onChange={handleAmountInput} placeholder='Amount'/>
            <input type='text' value={description} onChange={handleDescriptionInput} placeholder='Description'/>
          

         
        </div>
    </div>

    {showDepositInfo && (
        <>
        <button className='depositBtn' onClick={submitTransaction}>Confirm Deposit</button>
        </>
   )}
    {showWithdrawInfo && (
        <>
        <button onClick={submitTransaction} className='withdrawBtn'>Confirm Withdraw</button>
        </>
    )}
    {showTransferInfo && (
        <>
        <button onClick={submitTranfer} className='transferBtn'>Confirm Transfer</button>
        </>
    )}
    

    
      </section>
    </>
  )
}
export default Transaction
    