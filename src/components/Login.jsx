import React, { useState } from "react";
import './UserInfo.css';

function Login(props) {
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });
    
    const [useGoogle, setUseGoogle] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
    
        setLoginInfo((prevInfo) => {
            return {
            ...prevInfo,
            [name]: value,
            };
        });
    }
    
    const handleLogin = (event) => {
        if (useGoogle) {
            props.onLoginWithGoogle(loginInfo)
        }
        else {
            props.onLogin(loginInfo)
        }
        event.preventDefault();
    };

    const handleCheckboxChange = (event) => {
        setUseGoogle(event.target.checked);
    };

    const handleShowRegister = (event) => {
        props.onShowRegister();
        event.preventDefault();
    };

    const handleCancelLogin = (event) => {
        props.onCancelLogin();
        event.preventDefault();
    };

    return (
    <div>
        <form className="user-info-form">
            <input name="email"
                value={loginInfo.email}
                onChange={handleChange}
                placeholder="E-mail"
            />
            <input name="password"
                value={loginInfo.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <div className="checkbox-container">
                <input 
                    type="checkbox" 
                    id="googleLogin" 
                    checked={useGoogle} 
                    onChange={handleCheckboxChange} 
                />
                <label htmlFor="googleLogin">Login with Google Account</label>
            </div>
            <div className="button-container">
                    <button onClick={handleLogin}>
                        {useGoogle ? "Login with Google" : "Login"}
                    </button>
                    <button onClick={handleShowRegister}>Register</button>
                    <button onClick={handleCancelLogin}>Cancel</button>
            </div>
        </form>
    </div>
    );
}

export default Login;
