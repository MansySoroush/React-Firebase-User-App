import React from "react";

export const LoginStatus = {
    NO_USER_LOGIN: 'NO_USER_LOGIN',
    LOGIN_IN_PROGRESS: 'LOGIN_IN_PROGRESS',
    COMPLETE_LOGIN: 'COMPLETE_LOGIN'
};

function Header(props) {

    const handleAuth = (event) => {
        if (event.target.id === 'loginButton'){
            props.onStartLogin();    
        } else {
            props.onLogout();    
        }
    };
        
    return (
        <header>
            <nav class="navbar navbar-expand-lg rounded" aria-label="Navbar">
                <div class="container-fluid d-flex justify-content-between align-items-center">
                    <h1>User Info App</h1>

                    <div>
                        {(props.userLoginStatus === LoginStatus.COMPLETE_LOGIN) && <p class="mb-0 d-inline">Welcome, <span id="userName">{props.userName}</span></p>} 
                        {(props.userLoginStatus === LoginStatus.COMPLETE_LOGIN) && <button class="btn btn-primary d-inline ms-2" id="logoutButton" onClick={handleAuth}>Logout</button>}
                        {(props.userLoginStatus === LoginStatus.NO_USER_LOGIN) && <button class="btn btn-primary d-inline ms-2" id="loginButton" onClick={handleAuth}>Login</button>}
                        {(props.userLoginStatus === LoginStatus.LOGIN_IN_PROGRESS) && <p class="mb-0 d-inline">Login is in progress...</p>}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
