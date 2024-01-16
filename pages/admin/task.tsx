import TaskList from '@/components/admin/task-list';
import { useState, useEffect } from 'react';
import Header from '@/components/admin/header';
import { Container } from '@mui/material';
import useAutoLogout from '@/hooks/useAutoLogout';

export default function Index() {

    const autoLogout = useAutoLogout();

    return (
        <>
            <Header />
            <Container component="main">
                <TaskList isHeaderVisible={true} />
            </Container>
        </>
    );

}