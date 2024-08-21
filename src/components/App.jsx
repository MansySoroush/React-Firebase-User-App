import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth"
import { BrowserRouter as Router } from 'react-router-dom';
import Header, { LoginStatus } from './Header';
import CreateArea, { ActiveMainPage } from './CreateArea';
import Footer from './Footer';

function App() {
  const [activeMainPage, setActiveMainPage] = useState(ActiveMainPage.HOME_PAGE);
  const [loginState, setLoginState] = useState(LoginStatus.NO_USER_LOGIN);

  const googleAuth = new GoogleAuthProvider();
  googleAuth.setCustomParameters({
    prompt: 'select_account'
  });
  const [user, setUser] = useAuthState(auth);

  const showUserLoginForm = async() => {
    setActiveMainPage(ActiveMainPage.LOGIN_PAGE);
    setLoginState(LoginStatus.LOGIN_IN_PROGRESS);
  }

  const userLogout = async () => {
    try {
      if (loginState === LoginStatus.COMPLETE_LOGIN) {
        // Logout user
        await auth.signOut();
      }
      setActiveMainPage(ActiveMainPage.HOME_PAGE);
      setLoginState(LoginStatus.NO_USER_LOGIN);
    } catch (error) {
        console.error("Error during Logout:", error);
    }
  }

  const userLogin = async (loginInfo) => {
    try {
      if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
        // Check if user hasn't register yet. (new user)
        const new_user = false;
        if (new_user) {
          setActiveMainPage(ActiveMainPage.REGISTER_PAGE);          
        } else {
          // Login user with Google
          setLoginState(LoginStatus.COMPLETE_LOGIN);
          setActiveMainPage(ActiveMainPage.USERS_PAGE);
        }
      }
    } catch (error) {
        console.error("Error during authentication:", error);
    }
  }

  const userLoginWithGoogle = async (loginInfo) => {
    try {
      if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
        // Check if user hasn't register yet. (new user)
        const new_user = false;
        if (new_user) {
          setActiveMainPage(ActiveMainPage.REGISTER_PAGE);          
        } else {
          // Login user with Google
          const result = await signInWithPopup(auth, googleAuth);
          setLoginState(LoginStatus.COMPLETE_LOGIN);
          setActiveMainPage(ActiveMainPage.USERS_PAGE);
        }
      }
    } catch (error) {
        console.error("Error during authentication:", error);
    }
  }

  const userRegister = async (userInfo) => {
    try {
      console.log(loginState);

      if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
        // Register new user

        // Login user with Google
        const result = await signInWithPopup(auth, googleAuth);
        setLoginState(LoginStatus.COMPLETE_LOGIN);
        setActiveMainPage(ActiveMainPage.USERS_PAGE);
      }
    } catch (error) {
        console.error("Error during authentication:", error);
    }
  }

  return (
    <Router>
      <Header userLoginStatus={loginState} userName={user && user.displayName} onStartLogin={showUserLoginForm} onLogout={userLogout} />
      <CreateArea activePage={activeMainPage} onLoginWithGoogle={userLoginWithGoogle} onLogin={userLogin} onRegister={userRegister}/>
      <Footer />
    </Router>
  )
}

export default App
