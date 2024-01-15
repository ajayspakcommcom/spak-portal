import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const useIsUserLoggedIn = (): boolean => {

    const userData = useSelector((state: RootState) => state.authAdmin);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = (userData.token || window.localStorage.getItem('jwtToken'));
        console.log(token);
        setIsLoggedIn(!!token);
    }, []);

    return isLoggedIn;
};

export default useIsUserLoggedIn;
