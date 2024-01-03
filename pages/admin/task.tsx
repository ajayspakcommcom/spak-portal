import TaskList from '@/components/admin/task-list';
import { useState, useEffect } from 'react';
import Header from '@/components/admin/header';
import { Container } from '@mui/material';

export default function Index() {

    return (
        <>
            <Header />
            <Container component="main">
                <TaskList isHeaderVisible={true} />
            </Container>
        </>
    );

}