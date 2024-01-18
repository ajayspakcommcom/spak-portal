import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { logout } from '@/redux/auth/auth-admin-slice';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Notification from '@/components/admin/notification';
import useAutoLogout from '@/hooks/useAutoLogout';

const pages = ['Task', 'Report', 'AdminReport', 'Voucher', 'Holiday', 'Leave', 'User', 'Client', 'AdminVoucher', 'AdminLeave'];
const settings = ['Logout'];


const Index = () => {

    const autoLogout = useAutoLogout();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (link: string) => {
        if (typeof link === 'string') {
            router.push(`/admin/${link.toLowerCase()}`);
            setAnchorElUser(null);
        }
        //setAnchorElNav(null);
    };

    const handleCloseUserMenu = (link: string) => {
        if (typeof link === 'string') {
            router.push(`/admin/${link.toLowerCase()}`);
            setAnchorElUser(null);
        }
    };

    const logoutHandler = async () => {
        const resp = await dispatch(logout());
        router.push('/admin/login');
    };

    React.useEffect(() => {
        console.log(userData);
    }, []);

    console.log(userData);

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                        <Typography variant="h6" noWrap component="a" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none' }}>
                            <Image className='pointer' src={require('../../public/assets/img/logo.png')} alt="Description of the image" layout="responsive" onClick={() => handleCloseUserMenu('dashboard')} />
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                                <MenuIcon />
                            </IconButton>
                            <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography variant="h5" noWrap component="a" href="#app-bar-with-responsive-menu" sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none' }}>LOGO</Typography>

                        {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (<Button key={page} onClick={() => handleCloseNavMenu(page)} sx={{ my: 2, color: 'white', display: 'block' }}>{page}</Button>))}
                        </Box> */}

                        {
                            userData.data.designation.toLowerCase() === 'admin' &&
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                {pages.map((page) => (
                                    (page.toLowerCase() === 'leave' || page.toLowerCase() === 'report' || page.toLowerCase() === 'voucher' || page.toLowerCase() === 'task') ? '' : <Button key={page} onClick={() => handleCloseNavMenu(page)} sx={{ my: 2, color: 'white', display: 'block' }}>{
                                        page === 'AdminVoucher' ? 'Voucher' : page === 'AdminLeave' ? 'Leave' : page === 'AdminReport' ? 'Report' : page
                                    }</Button>
                                ))}
                            </Box>
                        }

                        {
                            userData.data.designation.toLowerCase() !== 'admin' &&
                            <>
                                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                    {pages.map((page) => (
                                        (page.toLowerCase() === 'holiday' || page.toLowerCase() === 'user' || page.toLowerCase() === 'client') || page.toLowerCase() === 'adminvoucher' || page.toLowerCase() === 'adminreport' || page.toLowerCase() === 'adminleave' ? '' : <Button key={page} onClick={() => handleCloseNavMenu(page)} sx={{ my: 2, color: 'white', display: 'block' }}>{page}</Button>
                                    ))}
                                    <div className='notification-wrapper'>
                                        <Notification />
                                    </div>
                                </Box>
                            </>
                        }


                        <Box sx={{ flexGrow: 0 }}>
                            {
                                !userData.data.imgUrl &&
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={userData.data.firstName.toUpperCase()} src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                            }
                            {userData.data.imgUrl && <Image src={userData.data.imgUrl} alt="Description of the image" width={50} height={50} className='pointer user-photo-nav' onClick={handleOpenUserMenu} />}

                            <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                <div className='header-drop-down-wrapper' onClick={() => handleCloseUserMenu('profile')}>
                                    <MenuItem>
                                        <Typography textAlign="center">{'Hello, ' + userData.data.firstName[0] + '.' + userData.data.lastName}</Typography>
                                    </MenuItem>
                                </div>
                                {settings.map((setting, index) => (
                                    <div className='header-drop-down-wrapper' key={`setting-${index}`} onClick={setting === 'Logout' ? logoutHandler : () => handleCloseUserMenu(setting)}>
                                        <MenuItem>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                    </div>
                                ))}
                            </Menu>
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}

export default React.memo(Index);