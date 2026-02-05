import { useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const phoneNumber = useRef();
  const otp = useRef();
  
  const { loginCall, isFetching, error, loginSuccess } = useContext(AuthContext);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleEmailLogin = (e) => {
    e.preventDefault();
    loginCall({ email: email.current.value, password: password.current.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', {
        phoneNumber: phoneNumber.current.value
      });
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        phoneNumber: phoneNumber.current.value,
        otp: otp.current.value
      });
      loginSuccess(res.data.user);
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
    setOtpLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">WhatsApp Clone Login</h2>
        
        <div className="flex justify-center mb-6">
            <button 
                className={`px-4 py-2 ${!isPhoneLogin ? 'bg-green-100 text-green-700 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => {setIsPhoneLogin(false); setOtpSent(false);}}
            >
                Email
            </button>
            <button 
                className={`px-4 py-2 ${isPhoneLogin ? 'bg-green-100 text-green-700 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => setIsPhoneLogin(true)}
            >
                Phone
            </button>
        </div>

        {!isPhoneLogin ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
        ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                <input
                    placeholder="Phone Number (e.g. 1234567890)"
                    type="text"
                    required
                    disabled={otpSent}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    ref={phoneNumber}
                />
                
                {otpSent && (
                    <input
                        placeholder="Enter OTP"
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        ref={otp}
                    />
                )}

                <button
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    type="submit"
                    disabled={otpLoading}
                >
                    {otpLoading ? "Loading..." : (otpSent ? "Verify OTP" : "Send OTP")}
                </button>
                {otpSent && (
                    <button 
                        type="button" 
                        onClick={() => setOtpSent(false)}
                        className="w-full text-sm text-gray-500 underline mt-2"
                    >
                        Change Phone Number
                    </button>
                )}
            </form>
        )}

        {error && !isPhoneLogin && <span className="text-red-500 text-sm mt-2 block text-center">Something went wrong!</span>}
        
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
