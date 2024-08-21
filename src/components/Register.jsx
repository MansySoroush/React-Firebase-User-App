import React, { useState } from "react";
import './UserInfo.css';

function Register(props) {
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
        country: "",
    });
    
    function handleChange(event) {
        const { name, value } = event.target;
    
        setUserInfo((prevInfo) => {
            return {
            ...prevInfo,
            [name]: value,
            };
        });
    }
    
    const handleRegister = (event) => {
        props.onRegister(userInfo)
        event.preventDefault();
    };

    return (
    <div>
        <form className="user-info-form">
            <input name="email"
                value={userInfo.email}
                onChange={handleChange}
                placeholder="E-mail"
            />
            <input name="password"
                value={userInfo.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <input name="name"
                value={userInfo.name}
                onChange={handleChange}
                placeholder="Name"
            />
            <input name="phone"
                value={userInfo.phone}
                onChange={handleChange}
                placeholder="Phone"
            />
            <input name="country"
                value={userInfo.country}
                onChange={handleChange}
                placeholder="Country"
            />
            <button onClick={handleRegister}>Register</button>
        </form>
    </div>
    );
}

export default Register;
