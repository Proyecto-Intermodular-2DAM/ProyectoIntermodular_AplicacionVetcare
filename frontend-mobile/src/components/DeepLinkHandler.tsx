import React, { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';

const DeepLinkHandler: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const setupDeepLinks = async () => {
            App.addListener('appUrlOpen', (data: any) => {
                console.log('App opened with URL:', data.url);

                // Example URL: https://www.vetcare.dpdns.org/login?access_token=...
                const url = new URL(data.url);

                // We extract the path and search/hash
                const path = url.pathname;
                const search = url.search;
                const hash = url.hash;

                // For auth redirects, we want to go through our callback handler
                // as Supabase sometimes uses hash fragments which React Router needs to handle
                if (path === '/login' || path === '/signup' || path === '/auth/callback') {
                    navigate('/auth/callback' + search + hash, { replace: true });
                } else if (path) {
                    navigate(path + search + hash, { replace: true });
                }
            });
        };

        setupDeepLinks();

        // Cleanup listener on unmount
        return () => {
            App.removeAllListeners();
        };
    }, [navigate]);

    return null; // This component doesn't render anything
};

export default DeepLinkHandler;
