// hooks/useAutoLogout.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const useAutoLogout = (): void => {

    let logoutTimer: NodeJS.Timeout;


    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const handleInactivity = (): void => {
        // Clear user session, authentication state, etc.
        localStorage.clear(); // Example: clear localStorage
        router.push('/admin/login'); // Redirect to login page
    };

    const resetTimer = (): void => {
        clearTimeout(logoutTimer);
        //logoutTimer = setTimeout(handleInactivity, 3600000); // Set to 1 hour (3600000 ms)
        logoutTimer = setTimeout(handleInactivity, 3600000); // Set to 1 hour (3600000 ms)
    };

    useEffect(() => {
        // Event listeners for user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);

        // Set initial timer
        resetTimer();

        // Cleanup on component unmount
        return () => {
            clearTimeout(logoutTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, []);
};

export default useAutoLogout;
