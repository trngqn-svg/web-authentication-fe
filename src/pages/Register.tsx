import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/axios'

interface RegisterFormValues {
  email: string,
  password: string,
  repeatPassword: string,
  terms: boolean,
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormValues>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Call backend API to register
      await api.post('/auth/register', { email: data.email, password: data.password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-300 rounded-xl shadow">
        <h2 className="text-2xl mb-6 text-center font-medium">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Invalid email format",
                  },
              })}
              className="w-full p-2 border border-gray-500 rounded"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required', 
                minLength: { value: 6, message: 'Password must be at least 6 characters' } 
              })}
              className="w-full p-2 border border-gray-500 rounded"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Repeat Password */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Repeat Password</label>
            <input
              type="password"
              {...register('repeatPassword', {
                required: 'Please repeat your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="w-full p-2 border border-gray-500 rounded"
              placeholder="Enter your repeat password"
            />
            {errors.repeatPassword && <p className="text-red-600 text-sm mt-1">{errors.repeatPassword.message}</p>}
          </div>

          {/* Terms Checkbox */}
          <div className="mb-4 flex items-start gap-2">
            <input
              type="checkbox"
              {...register("terms", {
                required: "You must agree before registering",
              })}
              className="mt-1 w-4 h-4"
            />

            <label className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-green-600 underline hover:text-green-700">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-600 underline hover:text-green-700">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {errors.terms && (
            <p className="text-red-600 text-sm -mt-3 mb-3">
              {errors.terms.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded font-medium bg-green-600 text-white mb-4 hover:bg-green-700"
          >
            Register
          </button>
        </form>

        <div className="text-center">
          <p>Don't have an account?
            <Link
              to="/login"
              className="ml-1 text-green-600 hover:text-green-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Back to Home button */}
      <div className="text-center mt-6">
        <Link
          to="/"
          className="inline-block py-2 px-4 text-green-600 border rounded-3xl hover:bg-gray-100"
        >
          <i className="fa-solid fa-arrow-left relative mr-2"></i>
          Back to Home
        </Link>
      </div>
    </div>
  );
}