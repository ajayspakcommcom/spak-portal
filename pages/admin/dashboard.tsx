import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import UserDashboard from '@/components/admin/user-dashboard';
import AdminDashboard from '@/components/admin/admin-dashboard';
import useAutoLogout from '@/hooks/useAutoLogout';


export default function Index() {

    const autoLogout = useAutoLogout();

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    // if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
    //     router.push('/admin/login');
    //     return false;
    // }

    console.log(userData);

    return (
        <>
            {userData.data.designation.toLowerCase() === 'admin' && <AdminDashboard />}
            {userData.data.designation.toLowerCase() !== 'admin' && <UserDashboard />}
        </>
    );



};