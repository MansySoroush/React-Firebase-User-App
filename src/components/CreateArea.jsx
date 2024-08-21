import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Users from './Users';
import Register from './Register';

export const ActiveMainPage = {
    HOME_PAGE: 'HOME_PAGE',
    USERS_PAGE: 'USERS_PAGE',
    LOGIN_PAGE: 'LOGIN_PAGE',
    REGISTER_PAGE: 'REGISTER_PAGE'
};

function CreateArea(props) {

    const handleLoginWithGoogle = async (loginInfo) => {
        props.onLoginWithGoogle(loginInfo);
    };

    const handleLogin = async (loginInfo) => {
        props.onLogin(loginInfo);
    };

    const handleRegister = async (userInfo) => {
        props.onRegister(userInfo);
    };

    return (
        <main>
            <Routes>
                {props.activePage === ActiveMainPage.HOME_PAGE && <Route path="/" element={<Home />} />}
                {props.activePage === ActiveMainPage.USERS_PAGE && <Route path="/" element={<Users />} />}
                {props.activePage === ActiveMainPage.LOGIN_PAGE && <Route path="/" element={<Login onLogin={handleLogin}  onLoginWithGoogle={handleLoginWithGoogle} />} />}
                {props.activePage === ActiveMainPage.REGISTER_PAGE && <Route path="/" element={<Register onRegister={handleRegister} />} />}
            </Routes>
        </main>
    );
}

export default CreateArea;
