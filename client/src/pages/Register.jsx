import { useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const { loginCall } = useContext(AuthContext); // To auto login
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("http://localhost:5000/api/auth/register", user);
        // After register, redirect to login or auto login
        navigate('/login');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Create Account</h2>
        <form onSubmit={handleClick} className="space-y-4">
          <input
            placeholder="Username"
            required
            ref={username}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            placeholder="Email"
            required
            ref={email}
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            placeholder="Password"
            required
            ref={password}
            type="password"
            minLength="6"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            placeholder="Password Again"
            required
            ref={passwordAgain}
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700" type="submit">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-green-600 hover:underline">
            Log into Account
          </Link>
        </div>
      </div>
    </div>
  );
}
