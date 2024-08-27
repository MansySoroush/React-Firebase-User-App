import React, { useEffect, useState } from 'react';
import './userCards.css';

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
            <div className='user-card-container'>
                {users.map(user => (
                    <div className='user-card' key={user.uid}>
                        <img src={user.photoURL || 'https://via.placeholder.com/150'} alt={`${user.displayName || user.email}`} className='user-avatar' />
                        <div className='user-info'>
                            <h2>{user.displayName || user.email}</h2>
                            <p>{user.email}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Users;
