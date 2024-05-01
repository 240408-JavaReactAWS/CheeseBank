import React from 'react';

const UserTable: React.FC = () => {
  return (
    <div>
      <table className="user-table">
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
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>user1</td>
                <td>Smith</td>
                <td>James</td>
                <td>1990-10-01</td>
                <td>user1@email.com</td>
                <td>000-000-0000</td>
                <td>$888.00</td>
                <button>View</button>
            </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;