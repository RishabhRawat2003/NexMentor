import React, { useState , useCallback} from 'react'
import Logo from './images/loginSignupPageImages/logoSideImage.webp';
import TextField from '@mui/material/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import Loading from './utils/Loading';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from '@mui/material';
import ErrorPopup from './utils/ErrorPopUp';

function ResetLink() {
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    // const [passwordChangedPopUp, setPasswordChangedPopUp] = useState(false)
    // const [errorPopUp, setErrorPopUp] = useState(false)
    const [dialogs, setDialogs] = useState({
        passwordChanged: false,
        error: false,
    });
    const [errorMsg, setErrorMsg] = useState('')
    const { token } = useParams();
    const navigate = useNavigate()

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    }, []);


    function handleLogin() {
        navigate('/login')
    }

    function handleCloseErrorPopUp() {
        setDialogs(prev => ({ ...prev, error: true }));
    }

    const resetPassword = useCallback(async () => {
        if (passwords.password !== passwords.confirmPassword) {
            setErrorMsg("Passwords do not match");
            setDialogs(prev => ({ ...prev, error: true }));
            return;
        }
        try {
            setLoading(true)
            const response = await axios.post(`/api/v1/mentors/reset-password/${token}`, passwords)
            if (response.data.statusCode === 200) {
                setLoading(false)
                setDialogs(prev => ({ ...prev, passwordChanged: true }));
            }
        } catch (error) {
            console.error("Error while reseting password!", error);
            setErrorMsg(error.response?.data?.message || "An error occurred");
            setDialogs(prev => ({ ...prev, error: true }));
            setLoading(false);
        }
    }, [passwords]);


    return (
        <>
            {loading && <Loading />}
            {dialogs.passwordChanged && (
                <Dialog open={dialogs.passwordChanged} onClose={() => setDialogs(prev => ({ ...prev, passwordChanged: true }))}>
                    <DialogTitle>Password reset Successfully</DialogTitle>
                    <DialogContent>
                        <Typography>Your password has been successfully Changed!</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleLogin} color="primary" variant="contained">Login</Button>
                    </DialogActions>
                </Dialog>
            )}
            <ErrorPopup open={dialogs.error} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
            <div className='w-screen h-screen flex justify-center items-center'>
                <div className='w-[95vw] h-auto border-2 p-5 py-20 sm:w-[60vw] md:w-[50vw] lg:px-10 lg:w-[40vw] xl:w-[30vw] bg-gray-100 rounded-md shadow-lg'>
                    <div className='w-full h-auto flex justify-center items-center'><img src={Logo} alt="logo alt" /></div>
                    <div className='w-full h-auto flex flex-col justify-center items-center font-cg-times my-10 gap-2'>
                        <h1 className='text-2xl font-semibold md:text-3xl xl:text-4xl'>Change Your Password</h1>
                        <p className='text-gray-500 text-xs text-center md:text-sm xl:text-base'>Enter a new password below to change your password.</p>
                    </div>
                    <TextField
                        label="New Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type='password'
                        value={passwords.password}
                        onChange={(e) => handleChange(e)}
                        name='password'
                    />
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type='password'
                        value={passwords.confirmPassword}
                        onChange={(e) => handleChange(e)}
                        name='confirmPassword'
                    />
                    <div onClick={resetPassword} className='w-auto h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md mx-5 active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
                        Reset Password
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetLink