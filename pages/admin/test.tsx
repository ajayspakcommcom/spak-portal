import * as React from 'react';
import UserDashboard from '@/components/admin/user-dashboard';
import Header from '@/components/admin/header';
import { Container } from '@mui/material';

export default function Index() {

    <>
        <Header />
        <Container component="main">
            <h1>Dashboard</h1>
        </Container>
    </>

};