import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginForm/LoginForm'
import Home from './pages/Home/Home';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login/" element={<LoginForm />} />
        <Route path="/home/" element={<Home />} />
      </Routes>
    </Router>
  );
}
export default App;