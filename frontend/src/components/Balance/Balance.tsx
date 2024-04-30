import React from 'react'
import { User } from '../../models/User';

interface BalanceProps {
  user:User;

}

function Balance(props:BalanceProps) {
  return (
    <div>
      <h1>Balance</h1>
      <h2>{props.user.balance}</h2>
      
    </div>
  )
}

export default Balance
