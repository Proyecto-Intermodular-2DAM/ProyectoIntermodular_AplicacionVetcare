import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            // Supabase puts tokens in the hash (#) for some flows and query (?) for others
            const hash = window.location.hash;
            const search = window.location.search;

            console.log('Processing auth callback...', { hash, search });

            // The supabase-js library handles tokens in the hash automatically 
            // upon initialization or onAuthStateChange, but we want to ensure 
            // we navigate to the right place once the session is established.

            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error in auth callback:', error.message);
                navigate('/login', { replace: true });
                return;
            }

            if (session) {
                // Determine where to go based on the context
                // If it was a password recovery, we might want to go to /reset-password
                // Supabase doesn't always tell us the 'type' in the session, 
                // but we can check the URL parameters.

                const params = new URLSearchParams(search || hash.replace('#', '?'));
                const type = params.get('type');

                if (type === 'recovery') {
                    navigate('/reset-password', { replace: true });
                } else {
                    navigate('/home', { replace: true });
                }
            } else {
                // No session yet, maybe it's still processing or invalid
                console.warn('No session found in callback');
                // Optional: add a timeout or a manual "verify" check if using OTP
                navigate('/login', { replace: true });
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'white' }}>
            <p>Procesando inicio de sesión...</p>
        </div>
    );
};

export default AuthCallback;
