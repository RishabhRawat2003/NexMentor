import React, { useState, useCallback, lazy, Suspense } from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Loading from './utils/Loading';
import ErrorPopup from './utils/ErrorPopUp';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from '@mui/material';
import Logo from './images/logo2.webp';
import ForgotImage from './images/loginSignupPageImages/forgetPassword.webp'

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [errorPopUp, setErrorPopUp] = useState(false);
    const [linkSendPopup, setLinkSendPopUp] = useState(false);

    const handleCloseErrorPopUp = useCallback(() => {
        setErrorPopUp(false);
    }, []);

    const sendResetLink = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/v1/mentors/forgot-password", { email });
            setLoading(false);
            if (response.data.statusCode === 200) {
                setLinkSendPopUp(true);
                setEmail('');
            }
        } catch (error) {
            console.error("Error while sending reset link", error);
            setLoading(false);
            setErrorMsg(error.response?.data?.message || 'An error occurred');
            setErrorPopUp(true);
        }
    }, [email]);

    return (
        <>
            {loading && <Loading />}
            {linkSendPopup && (
                <Dialog open={linkSendPopup} onClose={() => setLinkSendPopUp(false)}>
                    <DialogTitle>Password Reset Request</DialogTitle>
                    <DialogContent>
                        <Typography>
                            We have sent the password reset link to your email. If you do not receive the email within a few minutes, please check your spam folder or ensure that you have entered the correct email address.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setLinkSendPopUp(false)} color="primary" variant="contained">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <ErrorPopup open={errorPopUp} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
            <header className='w-full h-auto flex items-center p-5 xl:hidden'>
                <img src={Logo} alt="neXmentor Logo" className='w-40 sm:w-52 md:w-60' />
            </header>
            <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
                <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
                    {/* <div className='hidden xl:flex xl:flex-col xl:border-[1px] xl:w-[50%] 2xl:w-[45%] xl:h-[85vh] xl:rounded-xl xl:overflow-hidden xl:bg-[#E0E0E0]'>
                        <div className='w-full h-auto flex justify-between items-center p-8'>
                            <img src={Logo} alt="neXmentor Logo" className='w-60' />
                            <NavLink to="/" className='px-5 py-2 bg-[#4A4A4A94] flex items-center gap-3 text-white font-cg-times rounded-full cursor-pointer'>
                                <FaArrowLeftLong />Back to Homepage
                            </NavLink>
                        </div>
                        <div className='w-full h-auto flex flex-col items-center font-cg-times my-5 gap-4'>
                            <h1 className='text-5xl font-semibold'>Forgot Password?</h1>
                            <p className='text-lg'>Don't you worry, you can change your password here.</p>
                        </div>
                        <img src={ForgotImage} alt="Forgot-Image Logo" className='object-contain w-[25vw] mx-auto' />
                    </div> */}
                    <img src={ForgotImage} alt="Forgot-Image Logo" className='xl:object-contain hidden xl:block xl:w-[50%] 2xl:w-[45%] xl:h-[85vh] xl:rounded-xl' />

                    <div className='w-auto h-auto flex flex-col mt-10 mx-5 xl:w-[35%] 2xl:w-[30%] font-cg-times'>
                        <h1 className='text-center text-2xl font-semibold md:text-3xl xl:text-5xl'>Forgot Password</h1>
                        <p className='w-full h-auto text-center text-sm text-gray-500 mt-6 mb-10 md:text-base'>
                            Enter your email address below to receive a password reset link now.
                        </p>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div
                            onClick={sendResetLink}
                            className='w-full h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer'
                        >
                            Send Reset Link
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
