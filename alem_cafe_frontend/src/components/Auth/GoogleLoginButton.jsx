// src/components/Auth/GoogleLoginButton.jsx
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      // credentialResponse.credential is the Google ID token
      const idToken = credentialResponse.credential;
      
      // Send to your backend for verification
      const result = await googleLogin(idToken);
      
      toast.success(t('login.googleSuccess') || 'Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || t('login.googleFailed') || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error('Google login error: Popup closed or authentication failed');
    toast.error(t('login.googleFailed') || 'Google login failed');
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full bg-white/10 border border-white/20">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold"></div>
          <span className="text-white text-sm">Redirecting...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          theme="filled_blue"
          size="large"
          text="continue_with"
          shape="pill"
          width="100%"
        />
      )}
    </div>
  );
};

export default GoogleLoginButton;