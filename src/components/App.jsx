import Header from './Header';
import Footer from './Footer';
import CreateArea from './CreateArea';

function App() {

  const userLogin = (user) => {
    console.error("Complete Login");
  }

  const userLogout = () => {
    console.error("Complete Logout");
  }

  return (
    <div>
      <Header onLogin={userLogin} onLogout={userLogout} />
      <CreateArea />
      <Footer />
    </div>
  )
}

export default App
