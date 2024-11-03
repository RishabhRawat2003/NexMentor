import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
} from '@mui/material';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailOTP({ open, handleClose, email, userType }) {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorPopup, setErrorPopUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [msgPopUp, setMsgPopUP] = useState(false);

    const id = JSON.parse(localStorage.getItem("userId"));
    const navigate = useNavigate()

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    async function handleResendOtp() {
        try {
            setLoading(true);
            const endpoint = userType === 'mentor' ? "/api/v1/mentors/resend-otp" : "/api/v1/students/resend-otp";
            const response = await axios.post(endpoint, { id });
            if (response.status === 200) {
                setLoading(false);
                setMsgPopUP(true);
                setTimeout(() => {
                    setMsgPopUP(false);
                }, 4000);
            }
        } catch (error) {
            console.log("Error while resending OTP: ", error);
            setLoading(false);
        }
    }

    const handleVerify = async () => {
        try {
            setLoading(true);
            const endpoint = userType === 'mentor' ? "/api/v1/mentors/verify-email" : "/api/v1/students/verify-email";
            const response = await axios.post(endpoint, { email, otp });
            if (response.data.statusCode === 200) {
                setLoading(false);
                if (userType === 'mentor') {
                    navigate('/signup/mentor-signup')
                } else {
                    handleClose(true);
                }
            }
        } catch (error) {
            console.log("Error while verifying OTP: ", error);
            setLoading(false);
            setErrorMsg(error.response?.data?.message || "An error occurred");
            setErrorPopUp(true);

            // Automatically hide the error message after 4 seconds
            setTimeout(() => {
                setErrorPopUp(false);
                setErrorMsg('');
            }, 4000);
        }
    };

    return (
        <>
            {loading && (
                <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <Dialog open={open}>
                <DialogTitle>Verify Your Email</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        We have sent an OTP to your email. Please enter the OTP below to verify your email address.
                        <span onClick={handleResendOtp} className='text-[#0092DB] cursor-pointer md:hover:underline active:underline'>
                            Resend OTP
                        </span>
                    </Typography>
                    <TextField
                        label="Enter OTP"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={otp}
                        onChange={handleOtpChange}
                    />
                    {errorPopup && (
                        <p className='text-red-500'>{errorMsg}</p>
                    )}
                    {msgPopUp && (
                        <p className='text-green-500'>OTP resent successfully</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleVerify} color="primary" variant="contained">
                        Verify OTP
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
