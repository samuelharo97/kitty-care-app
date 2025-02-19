// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { LoginForm } from '../components/Login/LoginForm';
import Layout from '../components/Layout';
import { changeMethod } from '../Redux/features/billingSlice';
import { useAppDispatch } from '../Redux/hooks';
import ReactPixel from 'react-facebook-pixel';
import { useNavigate } from 'react-router-dom';
import { loginUserWithGoogleAsync } from '../Redux/features/userSlice';
import { UseRiveParameters } from '@rive-app/react-canvas';
import { GoogleSignInButton } from '../components/Login/GoogleSignInButton';
import Divider from '../components/Login/Divider';
import { isAuthenticated } from '../utils/auth';

interface LoginError {
  email?: string;
  otp?: string;
  general?: string;
}

const RIVE_ANIMATION_CONFIG: UseRiveParameters = {
  src: 'riv/V2/Pulse_kitty.riv',
  autoplay: true
};

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<LoginError>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle plan selection from URL
  useEffect(() => {
    const user = isAuthenticated();
    if (user) {
      navigate('/user-profile');
    }
  }, []);

  const handleGoogleLoginSuccess = async (idToken: string) => {
    setIsLoading(true);
    try {
      console.log('entered try 1');
      await dispatch(loginUserWithGoogleAsync(idToken)).unwrap();
      navigate('/user-profile');
    } catch (err: any) {
      setError({ general: err.message || 'Google login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = (errorMsg: string) => {
    setError({ general: errorMsg });
  };

  /* const { RiveComponent } = useRive(RIVE_ANIMATION_CONFIG); */
  const isPhone = window.innerWidth < 768;

  return (
    <Layout>
      <div
        className={`m-auto sm:w-[600px] max-w-[90%] px-[21px] sm:px-[80px] bg-white border-2 rounded-3xl border-[#B8B8B8] mt-8 ${
          isPhone ? 'py-[47px] sm:py-[70px]' : 'pb-[47px] sm:pb-[70px]'
        }`}
      >
        {/*  {!isPhone && (
          <div className={`${styles.animationContainer} mx-auto h-[200px]`}>
            {RiveComponent && <RiveComponent />}
          </div>
        )} */}
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h2 className="text-[28px] sm:text-[40px] mt-12 font-semibold pb-4">
              Login
            </h2>
            <p className="font-semibold text-gray-500 text-md md:text-xl">
              New to KittyCare?{' '}
              <span className="text-blue-600 cursor-pointer" onClick={() => {}}>
                Sign up for free.
              </span>
            </p>
          </div>

          <div className="w-full flex flex-col items-center">
            <LoginForm
              error={error.general || error.email}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <Divider opacity={20} width={150} />
            <div className="px-4">
              <GoogleSignInButton
                onError={handleGoogleLoginError}
                onSuccess={handleGoogleLoginSuccess}
              />
            </div>
            <Divider opacity={20} width={150} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
