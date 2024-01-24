import React, { useState, MouseEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import getConfig from 'next/config';
import { formatDateToDDMMYYYY } from '@/utils/common';
const { publicRuntimeConfig } = getConfig();
import CloseIcon from '@mui/icons-material/Close';
import { ObjectId } from 'mongodb';
import Image from 'next/image';


// type LeaveNotification = {
//     _id?: string | undefined;
//     createdDate: Date | undefined | string;
//     leaveId: string;
//     requestedDate: Date | string | undefined;
//     status: string;
// };

type User = {
    date: Date;
    designation: string;
    doj: Date;
    firstName: string;
    imgUrl: string;
    lastName: string;
    username: string;
};

type Voucher = {
    approvalStatus: string;
    notificationId: string;
    personId: Date;
    refId: string;
    voucherAmount: number;
    voucherDate: Date;
};

type Leave = {
    notificationId: string;
    isApproved: string;
    reason: string;
    createdDate: Date;
    startDate: string;
    refId: string;
};

type VoucherNotification = {
    user: User,
    voucher: Voucher
};

type LeaveNotification = {
    user: User,
    leave: Leave
};

const Index: React.FC = () => {

    const userData = useSelector((state: RootState) => state.authAdmin);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [leaveList, setLeaveList] = useState<LeaveNotification[]>([]);
    const [voucherList, setVoucherList] = useState<VoucherNotification[]>([]);

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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}notification/admin-leave`, JSON.stringify({ type: "LEAVELIST" }), config);
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

    const fetchVoucherData = async () => {
        try {
            if (userData && userData.token) {

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}notification/admin-voucher`, JSON.stringify({ type: "VOUCHERLIST" }), config);

                if (response.status === 200) {
                    setVoucherList(response.data);
                }

            } else {
                console.error('No token available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    const deleteVoucherNotification = async (id: string) => {
        console.log('Voucher');
        console.log(id);

        try {
            if (userData && userData.token) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const objData = {
                    id: id,
                    type: "DELETE"
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}notification/admin-voucher`, JSON.stringify(objData), config);
                console.log(response);

                if (response.status === 200) {
                    fetchVoucherData();
                }

            } else {
                console.error('No token available');
            }

        } catch (error) {
            console.error('Error creating data:', error);
        }

    };

    const deleteLeaveNotification = async (id: string) => {

        try {
            if (userData && userData.token) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const objData = {
                    id: id,
                    type: "DELETE"
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}notification/admin-leave`, JSON.stringify(objData), config);
                console.log(response);

                if (response.status === 200) {
                    fetchLeaveData();
                }

            } else {
                console.error('No token available');
            }

        } catch (error) {
            console.error('Error creating data:', error);
        }
    };

    useEffect(() => {
        fetchLeaveData();
        fetchVoucherData();
    }, []);

    return (
        <div>

            <Button aria-describedby={id} onClick={handleClick} className='notification-button-wrapper'>
                {(leaveList.length > 0 || voucherList.length > 0) && <span className='count-notification'>{leaveList.length + voucherList.length}</span>}
                <NotificationsIcon color="primary" fontSize="medium" style={{ fill: '#fff' }} />
            </Button>

            {
                (leaveList.length > 0 || voucherList.length > 0) &&
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>

                    {
                        leaveList.length > 0 &&
                        <section className='notification-section'>
                            <Typography className='notification-heading'>Leave</Typography>
                            {leaveList.map((row, index) => <div key={index} className='notification-content-wrapper'>
                                <Typography className='notification-text admin-leave-text'>
                                    {row.user.imgUrl && <Image src={row.user.imgUrl} alt="Description of the image" layout="responsive" width={50} height={50} className='pointer user-photo-nav notification' />}
                                    <span>{row.user.firstName}</span>
                                    <span >{formatDateToDDMMYYYY(row.leave.startDate)}</span>
                                    <span onClick={() => deleteLeaveNotification(row.leave.notificationId as string)}><CloseIcon color='inherit' /></span>
                                </Typography>
                            </div>)}
                        </section>
                    }

                    {
                        voucherList.length > 0 &&
                        <section className='notification-section'>
                            <Typography className='notification-heading'>Voucher</Typography>
                            {voucherList.map((row, index) => <div key={index} className='notification-content-wrapper'>
                                <Typography className='notification-text admin-text'>
                                    {row.user.imgUrl && <Image src={row.user.imgUrl} alt="Description of the image" layout="responsive" width={50} height={50} className='pointer user-photo-nav notification' />}
                                    <span>{row.user.firstName}</span>
                                    <span >{formatDateToDDMMYYYY(row.voucher.voucherDate)}</span>
                                    <span >{row.voucher.voucherAmount}</span>
                                    <span onClick={() => deleteVoucherNotification(row.voucher.notificationId as string)}><CloseIcon color='inherit' /></span>
                                </Typography>
                            </div>)}
                        </section>
                    }


                </Popover>
            }


        </div>
    );
};

export default React.memo(Index);
