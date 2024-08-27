import React, { useEffect, useState } from 'react';

function Users() {
    const [users, setUsers] = useState([]);
 /*   
    useEffect(() => {
        fetch('/api/users')
            .then(response => {
                console.log('Raw response:', response);
                if (!response.ok) {
                    console.error('Network response was not ok');
                    throw new Error('Network response was not ok');
                }
                console.error('response.status : ' + response.status);
                console.error('response.data : ' + response.data);
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                setUsers(data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);
        */
    return (
        <div className='users'>
            <h1>Registered Users:</h1>

            <ul>
                {users.map(user => (
                <li key={user.uid}>
                    {user.displayName || user.email}
                </li>
                ))}
            </ul>
        </div>
    );
}

export default Users;
