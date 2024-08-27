import React, { useState } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { BrowserRouter as Router } from 'react-router-dom';
import Header, { LoginStatus } from './Header';
import CreateArea, { ActiveMainPage } from './CreateArea';
import Footer from './Footer';
import { loginUserWithEmailAndPassword,
          loginUserWithGoogle,
          isRegisteredUser,
          registerUserWithEmailAndPassword, 
          LoginResult,
          RegisterResult} from "../firebaseCRUD";

const RegisterStatus = {
  JUST_REGISTER: 'JUST_REGISTER',
  REGISTER_BEFORE_LOGIN: 'REGISTER_BEFORE_LOGIN',
  REGISTER_DONE: 'REGISTER_DONE'
};

function App() {
  const [activeMainPage, setActiveMainPage] = useState(ActiveMainPage.HOME_PAGE);
  const [loginState, setLoginState] = useState(LoginStatus.NO_USER_LOGIN);
  const [currentUser, setCurrentUser] = useAuthState(auth);
  const [currentUserName, setCurrentUserName] = useState("");
  const [errorRegisterMessage, setErrorRegisterMessage] = useState("");
  const [errorLoginMessage, setErrorLoginMessage] = useState("");
  const [registerStatus, setRegisterStatus] = useState(RegisterStatus.JUST_REGISTER);
  const [currentUserPhotoURL, setCurrentUserPhotoURL] = useState("");
  const [userRegisterInfo, setUserRegisterInfo] = useState({
      email: "",
      password: "",
  });

  const showUserLoginForm = () => {
    setActiveMainPage(ActiveMainPage.LOGIN_PAGE);
    setLoginState(LoginStatus.LOGIN_IN_PROGRESS);
  }

  const resetUserLoginStatus = () => {
    setActiveMainPage(ActiveMainPage.HOME_PAGE);
    setLoginState(LoginStatus.NO_USER_LOGIN);
    setRegisterStatus(RegisterStatus.JUST_REGISTER);
    setCurrentUserName("");
    setErrorLoginMessage("");
    setErrorRegisterMessage("");
  }

  const completeUserLoginProcess = (userName, userPhotoURL) => {
    setLoginState(LoginStatus.COMPLETE_LOGIN);
    setActiveMainPage(ActiveMainPage.USERS_PAGE);
    setRegisterStatus(RegisterStatus.REGISTER_DONE);
    setErrorLoginMessage("");

    if (userName !== "") {
      setCurrentUserName(userName);
    }
/*
    if (userPhotoURL) {
      setCurrentUserPhotoURL(userPhotoURL);
    }
      */
  }

  const forceUserToLogout = async () => {
    if (currentUser) {
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
        if (loginInfo.email === "") {
          setErrorLoginMessage("Please enter your email!");
        } else if (loginInfo.password === "") {
          setErrorLoginMessage("Please enter password!");
        } else {
          const result = await loginUserWithEmailAndPassword(loginInfo.email, loginInfo.password);

          if (result.loginResult == LoginResult.SUCCESSFUL_LOGIN) {
            console.log("User logged in successfully:", result.user);
            completeUserLoginProcess(result.user.displayName, result.user.photoURL);
          } else if (result.loginResult == LoginResult.UNSUCCESSFUL_LOGIN_NEED_TO_REGISTER) {
              console.log("User needs to register.");
              setRegisterStatus(RegisterStatus.REGISTER_BEFORE_LOGIN);
        
              showUserRegisterFormWithRegisterInfo({
                email: loginInfo.email,
                password: loginInfo.password,
              });
          } else if (result.loginResult == LoginResult.UNSUCCESSFUL_LOGIN_INVALID_EMAIL) {
            setErrorLoginMessage("Invalid Email!");
          } else if (result.loginResult == LoginResult.UNSUCCESSFUL_LOGIN_WRONG_PASSWORD) {
            setErrorLoginMessage("Wrong Password!");
          }
        }
      }
    } catch (error) {
        console.error("Error during Login:", error.message);
    }
  }

  const userLoginWithGoogle = async (loginInfo) => {
    try {
      if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
        // Login user with Google
        const user = await loginUserWithGoogle();
        console.log(user);
        if (user) {
          console.log("Successful Login with Google!");
          completeUserLoginProcess(user.displayName, user.photoURL);
        } else {
          resetUserLoginStatus();
          console.log("Unsuccessful Login with Google!");
        }
    }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  }

  const userRegister = async (userInfo) => {
    try {
      if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
        if (userInfo.email === "") {
          setErrorRegisterMessage("Please enter your email!");
        } else if (userInfo.name === "") {
          setErrorRegisterMessage("Please enter name!");
        } else {
          const registeredUser = await isRegisteredUser(userInfo.email);
          if (registeredUser) {
            setErrorRegisterMessage("Duplicated email!");
          } else {
            const result = await registerUserWithEmailAndPassword(userInfo.email, userInfo.password, userInfo.name, userInfo.image);

            if (result.registerResult === RegisterResult.SUCCESSFUL_REGISTER) {
              if (registerStatus === RegisterStatus.REGISTER_BEFORE_LOGIN) {
                const loginRes = await loginUserWithEmailAndPassword(userInfo.email, userInfo.password);

                if (loginRes.loginResult == LoginResult.SUCCESSFUL_LOGIN) {
                  console.log("User logged in successfully:", loginRes.user);
                  completeUserLoginProcess(loginRes.user.displayName, loginRes.user.photoURL);
                } else {
                  console.log("Unsuccessful Login!");
                  resetUserLoginStatus();    
                }
              } else if (registerStatus === RegisterStatus.JUST_REGISTER) {
                setRegisterStatus(RegisterStatus.REGISTER_DONE);
                showUserLoginForm();
              }
            } else if (result.registerResult === RegisterResult.UNSUCCESSFUL_REGISTER_DUPLICATE_EMAIL) {
              console.log("Duplicated email!");
              setErrorRegisterMessage("Duplicated email!");
            } else if (result.registerResult === RegisterResult.UNSUCCESSFUL_REGISTER_INVALID_EMAIL) {
              console.log("Invalid Email!");
              setErrorRegisterMessage("Invalid Email!");
            } else if (result.registerResult === RegisterResult.UNSUCCESSFUL_REGISTER_WEAK_PASSWORD) {
              console.log("Weak Password!");
              setErrorRegisterMessage("Weak Password!");
            } else if (result.registerResult === RegisterResult.UNSUCCESSFUL_REGISTER_CREATE_USER) {
              console.log("Unsuccessful Registration!");
              setErrorRegisterMessage("Unsuccessful Registration!");
            }
          }
        }
      }
    } catch (error) {
        console.error("Error during Registration:", error);
    }
  }

  const showUserRegisterFormWithRegisterInfo = (regInfo) => {
    if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
      setUserRegisterInfo(regInfo);
      setErrorRegisterMessage("");
      setActiveMainPage(ActiveMainPage.REGISTER_PAGE);
    }
  }

  const showUserRegisterForm = () => {
    if (loginState === LoginStatus.LOGIN_IN_PROGRESS) {
      setUserRegisterInfo({});
      setErrorRegisterMessage("");
      setActiveMainPage(ActiveMainPage.REGISTER_PAGE);
    }
  }

  const cancelLogin = () => {
    if (currentUser) {
      forceUserToLogout();
    } else {
      resetUserLoginStatus();
    }
  }

  const cancelRegister = () => {
    if (currentUser) {
      forceUserToLogout();
    } else {
      resetUserLoginStatus();
    }
  }

  return (
    <Router>
      <Header userLoginStatus={loginState} 
              onStartLogin={showUserLoginForm} onLogout={userLogout}
              userName={currentUserName} userPhotoURL={currentUserPhotoURL} />
              
      <CreateArea activePage={activeMainPage} onLoginWithGoogle={userLoginWithGoogle} onLogin={userLogin} onCancelLogin={cancelLogin} 
                                              onRegister={userRegister} onShowRegister={showUserRegisterForm} onCancelRegister={cancelRegister}
                                              errorRegisterMessage={errorRegisterMessage} errorLoginMessage={errorLoginMessage}
                                              userRegisterInfo={userRegisterInfo} />

      <Footer />
    </Router>
  )
}

export default App;
