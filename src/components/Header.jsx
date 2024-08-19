import React, { userState } from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth"

function Header(props) {
    const googleAuth = new GoogleAuthProvider();
    const [user, setUser] = useAuthState(auth);

    const handleAuth = async() => {
        try {
            if (user) {
                // Logout user
                await auth.signOut();
                props.onLogout();
            } else {
                // Login user with Google
                const result = await signInWithPopup(auth, googleAuth);
                props.onLogin();
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };
        
    return (
        <header>
            <nav class="navbar navbar-expand-lg rounded" aria-label="Navbar">
                <div class="container-fluid d-flex justify-content-between align-items-center">
                    <h1>User Info App</h1>

                    <div>
                        {user && <p class="mb-0 d-inline">Welcome, <span id="userName">{user.displayName}</span></p>} 
                        <button class="btn btn-primary d-inline ms-2" id="loginButton" onClick={handleAuth}>{user ? "Logout" : "Login with Google"}</button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
