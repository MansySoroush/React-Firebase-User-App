import React, { useEffect, useState } from 'react';

function Users() {
    const [users, setUsers] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // client & server are running on different ports, 
        // so, it is needed to specify the full URL
        fetch(`${apiBaseUrl}/api/users`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);
        
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
