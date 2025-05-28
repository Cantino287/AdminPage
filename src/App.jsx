import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import QRLogin from './components/QR/QRLogin';
import AutoLogin from './pages/AutoLogin';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      {/* <Switch> */}
      <Routes>
        {/*   <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/auto-login" element={<AutoLogin />} />
        <Route path="/QRLogin" element={<QRLogin />} />
        <Route path="/employee" element={<AdminDashboard />} />
        {/* <Route path="/employee" element={<AdminDashboard />} /> */}
      </Routes>
      {/* </Switch> */}
    </Router>
  );
};

export default App;
