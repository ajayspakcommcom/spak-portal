import Header from '@/components/admin/header';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Container } from '@mui/material';

export default function Index() {

    const data = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    if (!data.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    if (data.token || window.localStorage.getItem('jwtToken')) {
        return (
            <>
                <Header />
                <Container>
                    <h1>Dash board</h1>
                </Container>
            </>
        );
    }

}