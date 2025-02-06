import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // 🔹 Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Form Submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage('');

    try {
      const endpoint = currentState === 'Login' 
        ? 'http://127.0.0.1:8000/api/user/login/'  // Change this to your actual login endpoint
        : 'http://127.0.0.1:8000/api/user/register/'; // Your signup API endpoint

      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (currentState==='Login') {
        localStorage.setItem('accessToken',response.data.access);
      }
      setMessage(`Success: ${response.data.message || 'Logged in!'}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 '>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Login' ? null : (
        <input type="text" name="username" value={formData.username} onChange={handleChange} 
          className='w-full px-3 py-2 border border-gray-800' placeholder='Username' required />
      )}
      
      <input type="email" name="email" value={formData.email} onChange={handleChange}
        className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      
      {currentState === 'Sign Up' && (
        <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} 
          className='w-full px-3 py-2 border border-gray-800' placeholder='Phone Number' required />
      )}

      <input type="password" name="password" value={formData.password} onChange={handleChange}
        className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

      {/* Show API Response Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        <p onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')} 
           className='cursor-pointer'>
          {currentState === 'Login' ? 'Create account' : 'Login Here'}
        </p>
      </div>

      <button className='bg-black text-white font-light px-8 py-2 mt-4'>
        {currentState === 'Login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
