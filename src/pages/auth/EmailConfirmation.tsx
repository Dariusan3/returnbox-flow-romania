import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function EmailConfirmation() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error getting user:', error.message);
          setVerificationStatus('error');
          return;
        }

        if (user?.email_confirmed_at) {
          setVerificationStatus('success');
          // Redirect to dashboard after 3 seconds
          if(user?.user_metadata?.role === 'merchant') {
            setTimeout(() => navigate('/dashboard'), 3000);
          }
          else if(user?.user_metadata?.role ==='customer') {
            setTimeout(() => navigate('/customer-dashboard'), 3000);
          }
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Error during email confirmation:', error);
        setVerificationStatus('error');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {verificationStatus === 'loading' && (
            <>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verifying your email...</h2>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <h2 className="mt-6 text-3xl font-extrabold text-green-600">Email verified successfully!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Redirecting you to the dashboard...
              </p>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <h2 className="mt-6 text-3xl font-extrabold text-red-600">Verification failed</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please check your email and click the verification link again.
              </p>
              <button
                onClick={() => navigate('/auth/login')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}