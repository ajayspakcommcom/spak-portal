import React, { useState, MouseEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import getConfig from 'next/config';
import { capitalizeFirstLetter } from '@/utils/common';
const { publicRuntimeConfig } = getConfig();
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


type Leave = {
    _id?: string | undefined;
    createdDate: Date | undefined | string;
    leaveId: string;
    startDate: string;
    status: string;
};

const Index: React.FC = () => {

    const userData = useSelector((state: RootState) => state.authAdmin);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [leaveList, setLeaveList] = useState<Leave[]>([]);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const fetchLeaveData = async () => {
        try {
            if (userData && userData.token) {

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}notification/leave`, JSON.stringify({ type: "LEAVELIST" }), config);
                console.log(response);

                if (response.status === 200) {
                    setLeaveList(response.data)
                }

            } else {
                console.error('No token available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    useEffect(() => {
        fetchLeaveData();
    }, []);

    return (
        <div>

            <Button aria-describedby={id} onClick={handleClick}><NotificationsIcon color="primary" fontSize="medium" style={{ fill: '#fff' }} /></Button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <section className='notification-section'>
                    <Typography className='notification-heading'>Leave</Typography>
                    {leaveList.map((row, index) => <div key={index} className='notification-content-wrapper'><Typography className='notification-text'>
                        <span>{row.startDate}</span>
                        <span style={{ color: row.status.toString() === 'rejected' ? 'red' : 'green' }}>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span>
                        <span><CheckCircleIcon color='inherit' /></span>
                    </Typography>
                    </div>)}
                </section>
                <section className='notification-section'>
                    <Typography className='notification-heading'>Voucher</Typography>
                    <Typography className='notification-text'>Your notifications..........</Typography>
                    <Typography className='notification-text'>Your notifications..........</Typography>
                </section>
            </Popover>
        </div>
    );
};

export default React.memo(Index);
