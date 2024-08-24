import React, { useState } from "react";
import './UserInfo.css';

function Register(props) {
    const [imagePreview, setImagePreview] = useState(null);
    const [userInfo, setUserInfo] = useState({
        email: props.userRegisterInfo.email,
        password: props.userRegisterInfo.password,
        name: "",
        phone: "",
        image: null,
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
    
    function handleImageChange(event) {
        const imageFile = event.target.files[0];
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            image: imageFile,
        }));
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
            <input name="phone"
                value={userInfo.phone}
                onChange={handleChange}
                placeholder="Phone"
            />
            <input name="image" 
                type="file" 
                onChange={handleImageChange} 
                accept="image/*"
            />
            {(props.errorRegisterMessage !== "") && 
                <div className="error-message-notice">
                    <p>{props.errorRegisterMessage}</p>
                </div>
            }
            <div className="button-container">
                <button onClick={handleRegister}>Register</button>
                <button onClick={handleCancelRegister}>Cancel</button>
            </div>
        </form>
    </div>
    );
}

export default Register;
