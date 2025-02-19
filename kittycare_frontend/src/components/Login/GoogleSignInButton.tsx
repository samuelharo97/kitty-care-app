import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  onError: (error: string) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError
}) => {
  return (
    <GoogleLogin
      shape="circle"
      containerProps={{ className: 'w-11 h-11' }}
      login_uri={window.location.origin}
      onSuccess={(credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
          onSuccess(credentialResponse.credential);
        } else {
          onError('No credential returned from Google');
        }
      }}
      onError={() => {
        onError('Google sign-in failed');
      }}
    />
  );
};
