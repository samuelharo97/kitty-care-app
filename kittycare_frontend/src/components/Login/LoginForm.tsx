import React, { FC, useState } from 'react';
import TextInput from './Input';

interface LoginFormProps {
  error?: string;
  isLoading?: boolean;
  onLogin?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({
  error,
  isLoading,
  onLogin,
  onForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid && onLogin) {
      onLogin(email, password);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <TextInput
        type="email"
        name="email"
        placeholder="name@email.com"
        value={email}
        label="Email"
        onChange={e => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        error={emailError}
        aria-invalid={!!emailError}
      />

      <div className="relative">
        <TextInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password (8+ characters)"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          error={passwordError}
          aria-invalid={!!passwordError}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
          aria-label="Toggle password visibility"
        ></button>
      </div>

      <div className="flex justify-end mt-1">
        <span
          onClick={() => onForgotPassword?.()}
          className="text-pink-500 text-sm cursor-pointer hover:underline"
        >
          Forgot password?
        </span>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full h-[50px] bg-blue-600 text-white text-base font-medium mt-5 rounded-md
                   hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed
                   transition-colors duration-200"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
