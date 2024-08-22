import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth"
import { BrowserRouter as Router } from 'react-router-dom';
import Header, { LoginStatus } from './Header';
import CreateArea, { ActiveMainPage } from './CreateArea';
import Footer from './Footer';
import { isNewUser, addUser } from "../firebaseCRUD";

function App() {
  const [activeMainPage, setActiveMainPage] = useState(ActiveMainPage.HOME_PAGE);
  const [loginState, setLoginState] = useState(LoginStatus.NO_USER_LOGIN);

  const googleAuth = new GoogleAuthProvider();
  googleAuth.setCustomParameters({
    prompt: 'select_account'
  });
  const [user, setUser] = useAuthState(auth);
  const [currentUserName, setCurrentUserName] = useState("");

  const showUserLoginForm = () => {
    setActiveMainPage(ActiveMainPage.LOGIN_PAGE);
    setLoginState(LoginStatus.LOGIN_IN_PROGRESS);
  }

  const resetUserLoginStatus = () => {
    setActiveMainPage(ActiveMainPage.HOME_PAGE);
    setLoginState(LoginStatus.NO_USER_LOGIN);
    setCurrentUserName("");
  }

  const completeUserLoginProcess = (userName) => {
    setLoginState(LoginStatus.COMPLETE_LOGIN);
    setActiveMainPage(ActiveMainPage.USERS_PAGE);

    if (userName !== "") {
      setCurrentUserName(userName);
    }
  }

  const forceUserToLogout = async () => {
    if (user) {
      try {
        // Logout user
        await auth.signOut();
      } catch (error) {
          console.error("Error during Logout:", error);
      }
    }
    resetUserLoginStatus();
  }

  const userLogout = async () => {
    try {
      if (loginState === LoginStatus.COMPLETE_LOGIN) {
        // Logout user
        await auth.signOut();
      }
      resetUserLoginStatus();
    } catch (error) {
        console.error("Error during Logout:", error);
    }
  }

  const userLogin = async (loginInfo) => {
    try {
      if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
        // Check if user hasn't register yet. (new user)
        const new_user = await isNewUser(loginInfo.email);
        if (new_user) {
          setActiveMainPage(ActiveMainPage.REGISTER_PAGE);
        } else {
          completeUserLoginProcess(loginInfo.name);
        }
      }
    } catch (error) {
        console.error("Error during Login:", error);
    }
  }

  const userLoginWithGoogle = async (loginInfo) => {
    try {
      if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
        // Login user with Google
        const result = await signInWithPopup(auth, googleAuth);

        if (result.user) {
          // Check if user hasn't register yet. (new user)
          const new_user = await isNewUser(result.user.email);

          if (new_user) {
            setActiveMainPage(ActiveMainPage.REGISTER_PAGE);
          } else {
            completeUserLoginProcess(result.user.displayName);
          }
        } else {
          resetUserLoginStatus();
        }
    }
    } catch (error) {
        console.error("Error during authentication:", error);
    }
  }

  const userRegister = async (userInfo) => {
    try {
      if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
        if ((userInfo.email === "") || (userInfo.name === "")) {
          console.log('empty user info');
          return;
        }

        // Register new user
        const newUserDoc = await addUser(userInfo.email, userInfo.name, userInfo.age, userInfo.phone, userInfo.country);

        completeUserLoginProcess("");
      }
    } catch (error) {
        console.error("Error during Registration:", error);
    }
  }

  const showUserRegisterForm = () => {
    if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
      setActiveMainPage(ActiveMainPage.REGISTER_PAGE);
    }
  }

  const cancelLogin = () => {
    if (user) {
      forceUserToLogout();
    } else {
      resetUserLoginStatus();
    }
  }

  const cancelRegister = () => {
    if (user) {
      forceUserToLogout();
    } else {
      resetUserLoginStatus();
    }
  }

  return (
    <Router>
      <Header userLoginStatus={loginState} userName={user && user.displayName} onStartLogin={showUserLoginForm} onLogout={userLogout} />
      <CreateArea activePage={activeMainPage} onLoginWithGoogle={userLoginWithGoogle} onLogin={userLogin} onCancelLogin={cancelLogin} 
                                              onRegister={userRegister} onShowRegister={showUserRegisterForm} onCancelRegister={cancelRegister}/>
      <Footer />
    </Router>
  )
}

export default App
