import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface FormValues {
  email: string,
  password: string,
}

export default function LoginPage() {
  const [errMessage, setErrMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const auth = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      await auth.login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrMessage(err?.response?.data?.message || err.message || 'Login failed');
    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-300 rounded-xl shadow">
        <h2 className="text-2xl mb-6 text-center font-medium">Sign in to your account</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            {...register('email', { required: 'Email is required' })} 
            className="w-full p-2 border border-gray-500 rounded" 
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" {...register('password', { required: 'Password is required' })} 
            className="w-full p-2 border border-gray-500 rounded" 
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          {errMessage && <p className="text-red-600 text-sm mt-1 mb-2">{errMessage}</p>}
        </div>
        <button type="submit" className="w-full py-2 font-medium rounded bg-blue-600 text-white">Sign in</button>
        </form>

        <div className="mt-3 text-center">
          <p>Don't have an account?
            <Link
              to="/register"
              className="ml-1 text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className="text-center mt-6">
        <Link
          to="/"
          className="inline-block py-2 px-4 text-blue-600 border rounded-3xl hover:bg-gray-100"
        >
          <i className="fa-solid fa-arrow-left relative mr-2"></i>
          Back to Home
        </Link>
      </div>
    </div>
  )
}