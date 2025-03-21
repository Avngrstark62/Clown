import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initiateUserRegistration, verifyOtpAndRegister, resendRegistrationOTP } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState(1); // Step 1: Registration form, Step 2: OTP verification
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [validationErrors, setValidationErrors] = useState({ username: '', password: '' });
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCounter, setResendCounter] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, message, registrationToken, registrationEmail } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate username and password as the user types
    if (name === 'username') {
      if (!/^[A-Za-z0-9_]+$/.test(value)) {
        setValidationErrors((prev) => ({
          ...prev,
          username: 'Username can only contain letters, numbers, and underscores.',
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, username: '' }));
      }
    }

    if (name === 'password') {
      if (value.length < 8) {
        setValidationErrors((prev) => ({
          ...prev,
          password: 'Password must be at least 8 characters long.',
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, password: '' }));
      }
    }
  };

  const handleOtpChange = (e) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (validationErrors.username || validationErrors.password) {
      return;
    }

    dispatch(initiateUserRegistration(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setStep(2);
      }
    });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      return;
    }
    
    dispatch(verifyOtpAndRegister({ token: registrationToken, otp })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    });
  };

  const handleResendOtp = () => {
    dispatch(resendRegistrationOTP({ token: registrationToken }));
    
    // Disable resend button for 60 seconds
    setResendDisabled(true);
    let countdown = 60;
    const timer = setInterval(() => {
      countdown -= 1;
      setResendCounter(countdown);
      if (countdown <= 0) {
        clearInterval(timer);
        setResendDisabled(false);
        setResendCounter(0);
      }
    }, 1000);
    
    // Increase the counter
    setResendCounter(countdown);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {step === 1 ? "Register" : "Verify Email"}
          </h2>
          {step === 2 && (
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a verification code to {registrationEmail || formData.email}
            </p>
          )}
        </div>

        {step === 1 ? (
          // Step 1: Registration Form
          <form className="mt-8 space-y-6" onSubmit={handleRegistrationSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {validationErrors.username && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.username}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Username can only contain letters, numbers, and underscores.
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {validationErrors.password && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Password must be at least 8 characters long.
                </p>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={!!validationErrors.username || !!validationErrors.password || loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </div>
          </form>
        ) : (
          // Step 2: OTP Verification Form
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">Verification Code</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit verification code"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                  maxLength={6}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest sm:text-sm"
                />
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Enter the 6-digit code sent to your email. (If you cant find it, check spam)
                </p>
              </div>
            </div>

            {message && !error && (
              <p className="text-sm text-green-500 text-center">{message}</p>
            )}

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={otp.length !== 6 || loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Register"}
              </button>
              
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendDisabled 
                  ? `Resend code in ${resendCounter}s` 
                  : "Didn't receive code? Resend"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <span className="text-sm text-gray-600">Already have an account?</span>
          <button
            onClick={goToLogin}
            className="ml-2 text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { registerUser } from '../redux/authSlice';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const Register = () => {
//   const [formData, setFormData] = useState({ username: '', email: '', password: '' });
//   const [validationErrors, setValidationErrors] = useState({ username: '', password: '' });
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { error } = useSelector((state) => state.auth);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Validate username and password as the user types
//     if (name === 'username') {
//       if (!/^[A-Za-z0-9_]+$/.test(value)) {
//         setValidationErrors((prev) => ({
//           ...prev,
//           username: 'Username can only contain letters, numbers, and underscores.',
//         }));
//       } else {
//         setValidationErrors((prev) => ({ ...prev, username: '' }));
//       }
//     }

//     if (name === 'password') {
//       if (value.length < 8) {
//         setValidationErrors((prev) => ({
//           ...prev,
//           password: 'Password must be at least 8 characters long.',
//         }));
//       } else {
//         setValidationErrors((prev) => ({ ...prev, password: '' }));
//       }
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Check for validation errors before submitting
//     if (validationErrors.username || validationErrors.password) {
//       return;
//     }

//     dispatch(registerUser(formData)).then((result) => {
//       if (result.meta.requestStatus === 'fulfilled') {
//         navigate('/login');
//       }
//     });
//   };

//   const gotologin = () => {
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
//         <div>
//           <h2 className="text-center text-3xl font-bold text-gray-900">Register</h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             {/* Username Field */}
//             <div>
//               <label htmlFor="username" className="sr-only">Username</label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 placeholder="Username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//               {validationErrors.username && (
//                 <p className="text-sm text-red-500 mt-1">{validationErrors.username}</p>
//               )}
//               <p className="text-sm text-gray-500 mt-1">
//                 Username can only contain letters, numbers, and underscores.
//               </p>
//             </div>

//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="sr-only">Email</label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//               {validationErrors.password && (
//                 <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
//               )}
//               <p className="text-sm text-gray-500 mt-1">
//                 Password must be at least 8 characters long.
//               </p>
//             </div>
//           </div>

//           {error && (
//             <p className="text-sm text-red-500 text-center">{error}</p>
//           )}

//           <div>
//             <button
//               type="submit"
//               disabled={!!validationErrors.username || !!validationErrors.password}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               Register
//             </button>
//           </div>
//         </form>

//         <div className="text-center">
//           <span className="text-sm text-gray-600">Already have an account?</span>
//           <button
//             onClick={gotologin}
//             className="ml-2 text-sm font-medium text-blue-500 hover:text-blue-600"
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;