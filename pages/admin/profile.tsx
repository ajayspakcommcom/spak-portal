import Header from '@/components/admin/header';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Avatar, Box, Typography, List, ListItem, Paper, Container, Button, TextField, FormControl, InputAdornment, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Image from 'next/image'
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import { postUpdateUser } from '../../redux/auth/auth-admin-slice';
import { ThunkDispatch } from "@reduxjs/toolkit";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SuccessAlert from '@/components/admin/success-alert';
import useAutoLogout from '@/hooks/useAutoLogout';
import Footer from '@/components/admin/footer';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import SuccessMessage from '@/components/admin/success-message';

type Profile = {
    _id?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    imgUrl?: string;
    date?: Date;
    designation?: string;
    doj?: Date;
    uploadDocument?: string;
    type: string;
};

interface ResponseType {
    error?: any;
    payload?: any;
}


export default function Index() {

    const autoLogout = useAutoLogout();

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [editMode, setEditMode] = React.useState<boolean>(false);
    const [imageDataUrl, setImageDataUrl] = React.useState(userData.data.imgUrl);
    const [userDocument, setUserDocument] = React.useState(userData.data.uploadDocument);
    const userDocInputRef = React.useRef<HTMLInputElement>(null);
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
    //     router.push('/admin/login');
    //     return false;
    // }

    const formik = useFormik<Profile>({
        initialValues: {
            _id: userData.data._id,
            firstName: userData.data.firstName,
            lastName: userData.data.lastName,
            username: userData.data.username,
            password: userData.data.password,
            imgUrl: userData.data.imgUrl,
            date: userData.data.date,
            designation: userData.data.designation,
            doj: userData.data.doj,
            uploadDocument: userData.data.uploadDocument,
            type: 'UPDATE'
        },

        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            password: Yup.string().required('Password is required'),
            designation: Yup.string().required('Designation is required'),
            doj: Yup.date().required('Designation is required')
        }),

        onSubmit: async (values) => {

            const objData: Profile = {
                _id: userData.data._id,
                firstName: values.firstName,
                lastName: values.lastName,
                password: values.password,
                imgUrl: imageDataUrl,
                date: new Date(),
                designation: values.designation,
                doj: values.doj,
                uploadDocument: userDocument,
                username: values.username,
                type: 'UPDATE',
            };

            console.log(objData);


            const response: ResponseType = await dispatch(postUpdateUser(objData));
            console.log(response);

            if (response.payload.status === 200) {
                setIsSuccess(true);
            }

            setTimeout(() => {
                setIsSuccess(false);
            }, 5000);

        }
    });

    const handleFileChange = (elem: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {

            const fileSize = file.size / 1024;

            if (fileSize < 600) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    if (typeof result === 'string') {

                        if (elem.toLowerCase() === 'userimg') {
                            setImageDataUrl(result);
                        }

                        if (elem.toLowerCase() === 'userdoc') {
                            setUserDocument(result);
                        }
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert('File size is too big. It should be less than 600Kb');
            }

        }
    };


    React.useEffect(() => {

    }, [useSelector, userData]);

    if (userData.token || window.localStorage.getItem('jwtToken')) {
        return (
            <>
                <Header />

                {/* <SuccessAlert isVisible={true} /> */}

                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>

                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>

                        <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>

                            <label htmlFor='userimg' className=''>
                                <Image src={imageDataUrl} height={100} width={100} alt="Description of the image" className='pointer round-img' />
                            </label>

                            <Typography component="h1" variant="h5">{'User'}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">{userData.data.username}</Typography>
                        </Box>

                        {
                            !editMode &&
                            <div>
                                <List>

                                    {
                                        userData.data.firstName &&
                                        <ListItem divider>
                                            <div className='profile-label-wrapper'>
                                                <span>First Name</span>
                                                <b>{userData.data.firstName}</b>
                                            </div>
                                        </ListItem>
                                    }

                                    {
                                        userData.data.lastName &&
                                        <ListItem divider>
                                            <div className='profile-label-wrapper'>
                                                <span>Last Name</span>
                                                <b>{userData.data.lastName}</b>
                                            </div>
                                        </ListItem>
                                    }

                                    <ListItem>
                                        <div className='profile-label-wrapper'>
                                            <span>Password</span>
                                            <b>{'.......'}</b>
                                        </div>
                                    </ListItem>

                                    {
                                        userData.data.designation &&
                                        <ListItem>
                                            <div className='profile-label-wrapper'>
                                                <span>Designation</span>
                                                <b>{userData.data.designation}</b>
                                            </div>
                                        </ListItem>
                                    }

                                    {
                                        userDocument &&
                                        <ListItem>
                                            <div className='profile-label-wrapper'>
                                                <span>Document</span>
                                                {userDocument && <div className='upload-doc'> <Image src={userDocument} height={100} width={100} alt="Description of the image" className='pointer round-img' /></div>}
                                            </div>
                                        </ListItem>
                                    }

                                    {
                                        userData.data.doj &&
                                        <ListItem>
                                            <div className='profile-label-wrapper'>
                                                <span>DOJ</span>
                                                <b>{userData.data.doj}</b>
                                            </div>
                                        </ListItem>
                                    }

                                </List>

                                <Box display="flex" justifyContent="flex-end" p={1}>
                                    <Button variant="contained" onClick={() => setEditMode(true)}>Edit</Button>
                                </Box>
                            </div>
                        }

                        {
                            editMode &&

                            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                                <Box >

                                    <Box mb={4} flex={1}>
                                        <TextField
                                            fullWidth
                                            id="firstName"
                                            name="firstName"
                                            label="First Name"
                                            type="text"
                                            value={formik.values.firstName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                            helperText={formik.touched.firstName && formik.errors.firstName}
                                        />
                                    </Box>

                                    <Box mb={4} flex={1}>
                                        <TextField
                                            fullWidth
                                            id="lastName"
                                            name="lastName"
                                            label="Last Name"
                                            type="text"
                                            value={formik.values.lastName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                            helperText={formik.touched.lastName && formik.errors.lastName}
                                        />
                                    </Box>

                                    <Box mb={2} flex={1}>
                                        <TextField
                                            fullWidth
                                            id="password"
                                            name="password"
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.password && Boolean(formik.errors.password)}
                                            helperText={formik.touched.password && formik.errors.password}

                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end">
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}

                                        />
                                    </Box>

                                    <Box mb={2} flex={1}>
                                        <TextField
                                            fullWidth
                                            id="designation"
                                            name="designation"
                                            label="Designation"
                                            type="text"
                                            value={formik.values.designation}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.designation && Boolean(formik.errors.designation)}
                                            helperText={formik.touched.designation && formik.errors.designation}
                                        />
                                    </Box>

                                    <Box mb={2} flex={1}>
                                        <TextField
                                            fullWidth
                                            id="doj"
                                            name="doj"
                                            label="DOJ"
                                            type="date"
                                            value={formik.values.doj}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.doj && Boolean(formik.errors.doj)}
                                            helperText={formik.touched.doj && formik.errors.doj}
                                        />
                                    </Box>

                                    <input type="file" id='userimg' name='userimg' onChange={(e) => handleFileChange('userimg', e)} accept="image/png, image/jpeg" className='upload-image' />

                                    <input type="file" id='userdoc' name='userdoc' onChange={(e) => handleFileChange('userdoc', e)} accept="image/png, image/jpeg" className='upload-image' ref={userDocInputRef} />

                                    <label htmlFor='userdoc'>
                                        <Button variant="contained" onClick={() => userDocInputRef.current && userDocInputRef.current.click()} startIcon={<CloudUploadIcon />}>Upload Document</Button>
                                    </label>

                                    {userDocument && <div className='upload-doc'> <Image src={userDocument} height={100} width={100} alt="Description of the image" className='pointer round-img' /></div>}

                                </Box>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="contained" onClick={() => setEditMode(false)} sx={{ mr: 2 }} color='inherit'>Cancel</Button>
                                    <Button variant="contained" type='submit' color='success'>Save</Button>
                                </Box>

                                {isSuccess && <SuccessMessage isVisible={true} message={<b>Profile updated successfully!</b>} />}

                            </form>
                        }

                    </Paper>

                </Container>

                <Footer />

            </>
        );
    }

}


