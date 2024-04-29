import React from 'react';
import User from './User';

const UserTable: React.FC = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Table Headers</th>
        </tr>
      </thead>
      <tbody>
        <User />
      </tbody>
    </table>
  );
}

export default UserTable;