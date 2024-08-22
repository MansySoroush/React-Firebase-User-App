import React, { useState } from "react";
import './UserInfo.css';

function Register(props) {
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        name: "",
        age: "",
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

    const handleCancelRegister = (event) => {
        props.onCancelRegister()
        event.preventDefault();
    };

    return (
    <div>
        <form className="user-info-form">
            <div className="register-notice">
                <p>Please register first before logging in.</p>
            </div>
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
            <input name="age"
                value={userInfo.age}
                onChange={handleChange}
                placeholder="Age"
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
            <div className="button-container">
                <button onClick={handleRegister}>Register</button>
                <button onClick={handleCancelRegister}>Cancel</button>
            </div>
        </form>
    </div>
    );
}

export default Register;
