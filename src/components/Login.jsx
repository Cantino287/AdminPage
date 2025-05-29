import React, { useState } from 'react';
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Install react-icons if not yet
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://cantino.onrender.com/account/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);

      // Expecting a structured response: { email, role, shop: { id } }
      const userData = response.data;

      const user = {
        email: userData.email,
        role: userData.role,
        shopId: userData.shop?.id || null,
      };

      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);
      localStorage.setItem('email', user.email);
      if (user.shopId) {
        localStorage.setItem('shopId', user.shopId);
      }

      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'employee' || 'Employee') {
        navigate('/employee');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Admin Login</h2>
      <input
        className="login-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="password-input-container">
                <input
                    className="login-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                </span>
            </div>
      <button
        className="login-button"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>

  );
};

export default Login;
