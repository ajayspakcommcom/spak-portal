import Header from '@/components/admin/header';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Avatar, Box, Typography, List, ListItem, ListItemText, Paper, Container } from '@mui/material';
import { useDispatch } from 'react-redux';


export default function Index() {

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();


    if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    // const userData = {
    //     name: 'John Doe',
    //     email: 'johndoe@example.com',
    //     details: ['Detail 1', 'Detail 2', 'Detail 3']
    // };

    React.useEffect(() => {

    }, [useSelector, userData]);

    if (userData.token || window.localStorage.getItem('jwtToken')) {
        return (
            <>
                <Header />

                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>JD</Avatar>
                            {/* <Typography component="h1" variant="h5">{userData.name}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">{userData.email}</Typography> */}
                        </Box>

                        {/* <List>
                            {userData.details.map((detail, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText primary={detail} />
                                </ListItem>
                            ))}
                        </List> */}

                        <List>
                            <ListItem divider>
                                <ListItemText primary={'First Name'} />
                            </ListItem>
                            <ListItem divider>
                                <ListItemText primary={'Last Name'} />
                            </ListItem>
                            <ListItem divider>
                                <ListItemText primary={'UserName'} />
                            </ListItem>
                            <ListItem divider>
                                <ListItemText primary={'First Name'} />
                            </ListItem>
                        </List>

                    </Paper>
                </Container>

            </>
        );
    }

}