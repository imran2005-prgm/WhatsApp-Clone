import { useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { loginCall, isFetching, error } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall({ email: email.current.value, password: password.current.value });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">WhatsApp Clone Login</h2>
        <form onSubmit={handleClick} className="space-y-4">
          <input
            placeholder="Email"
            type="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ref={email}
          />
          <input
            placeholder="Password"
            type="password"
            required
            minLength="6"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ref={password}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            type="submit"
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Log In"}
          </button>
        </form>
        {error && <span className="text-red-500 text-sm mt-2 block text-center">Something went wrong!</span>}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
