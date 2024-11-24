import React, { useState, useEffect } from 'react'
import Loading from './utils/Loading'
import PopupDialog from './utils/PopUp'
import { FormControl, Select, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from './utils/ErrorPopUp';

function FieldForPasswordChange({ passwords, setPasswords }) {

    const handleChange = (e) => {
        setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <>
            <div className='w-[90%] mx-auto my-4'>
                <TextField
                    label="Current Password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type='password'
                    value={passwords.oldPassword}
                    name='oldPassword'
                    onChange={(e) => handleChange(e)}
                />
                <TextField
                    label="New Password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type='password'
                    value={passwords.newPassword}
                    name='newPassword'
                    onChange={(e) => handleChange(e)}
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
            </div>
        </>
    )
}

function FieldForUpdateProfile({ userDetails, setUserDetails, gender, setGender, currentClass, setCurrentClass, image, setImage }) {
    const [preview, setPreview] = useState(userDetails.profilePicture);

    useEffect(() => {
        if (image) {
            setPreview(URL.createObjectURL(image));
        } else {
            setPreview(userDetails.profilePicture);
        }
    }, [image, userDetails.profilePicture]);

    const handleChangeClass = (event) => setCurrentClass(event.target.value);
    const handleChangeGender = (event) => setGender(event.target.value);

    const handleChange = (e) => {
        setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <div className='w-[90%] mx-auto my-4 flex flex-col'>
                <div className='w-full h-auto flex flex-col justify-center items-center space-y-4'>
                    <div className='w-32 h-32'>
                        <img src={preview} alt="Profile Image" className='w-full h-full object-cover rounded-full border border-gray-300 shadow-sm' />
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className='hidden' id="upload-button" />
                    <label htmlFor="upload-button" className='bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 active:bg-blue-700 transition-colors'>
                        Choose Image
                    </label>
                </div>
                <div className='w-full h-auto flex flex-col justify-between items-center sm:flex-row'>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        margin="normal"
                        className='w-full sm:w-[48%]'
                        value={userDetails.firstName}
                        name='firstName'
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        label="Last name"
                        variant="outlined"
                        margin="normal"
                        className='w-full sm:w-[48%]'
                        value={userDetails.lastName}
                        name='lastName'
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="w-full h-auto flex flex-col justify-between items-center sm:flex-row">
                    <TextField
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        className="w-full sm:w-[48%]"
                        value={userDetails.email}
                        name="email"
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        className="w-full sm:w-[48%]"
                        value={userDetails.username}
                        name="username"
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <TextField
                    label="Contact Number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={userDetails.number}
                    name="number"
                    onChange={(e) => handleChange(e)}
                />
                <div className='w-full h-auto gap-5 flex flex-col justify-between items-center sm:flex-row my-3'>
                    <FormControl className='w-full sm:w-[48%]'>
                        <Select
                            value={gender}
                            onChange={handleChangeGender}
                            displayEmpty
                            renderValue={(selected) => {
                                if (selected === "") {
                                    return <em>Gender</em>;
                                }
                                return selected;
                            }}
                        >
                            <MenuItem value="">
                                <em>Select a Gender</em>
                            </MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className='w-full sm:w-[48%]'>
                        <Select
                            value={currentClass}
                            onChange={handleChangeClass}
                            displayEmpty
                            renderValue={(selected) => {
                                if (selected === "") {
                                    return <em>Class</em>;
                                }
                                return selected;
                            }}
                        >
                            <MenuItem value="">
                                <em>Select your Class</em>
                            </MenuItem>
                            <MenuItem value="10th">10th</MenuItem>
                            <MenuItem value="11th">11th</MenuItem>
                            <MenuItem value="12th">12th</MenuItem>
                            <MenuItem value="Dropout">Dropout</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
        </>
    )
}


function AccountInformation({ data }) {
    const [passwordChangePopUp, setPasswordChangePopUp] = useState(false)
    const [editProfilePopUp, setEditProfilePopUp] = useState(false)
    const [userDetails, setUserDetails] = useState({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        number: data.number,
        username: data.username,
        profilePicture: data.profilePicture || ''
    })
    const [gender, setGender] = useState(data.gender ? data.gender : '')
    const [currentClass, setCurrentClass] = useState(data.currentClass ? data.currentClass : '')
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [errorPopup, setErrorPopUp] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [image, setImage] = useState(null)
    const navigate = useNavigate()

    function handleClose() {
        setPasswordChangePopUp(false)
    }

    function handleClose2() {
        setEditProfilePopUp(false)
    }

    function handleCloseErrorPopUp() {
        setErrorPopUp(false)
    }

    async function changePassword() {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/students/change-password", passwords)
            if (response.data.statusCode === 200) {
                setLoading(false)
                setPasswordChangePopUp(false)
                setPasswords({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }
        } catch (error) {
            console.log("Error While changing password", error);
            setLoading(false)
            setErrorMsg(error?.response?.data?.message)
            setErrorPopUp(true)
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        }
    }

    async function updateDetails() {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('firstName', userDetails.firstName);
            formData.append('lastName', userDetails.lastName);
            formData.append('email', userDetails.email);
            formData.append('number', userDetails.number);
            formData.append('username', userDetails.username);
            formData.append('gender', gender);
            formData.append('currentClass', currentClass);

            if (image) formData.append('profilePicture', image)

            const response = await axios.post("/api/v1/students/student-update-details", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (response.data.statusCode === 200) {
                setLoading(false)
                setEditProfilePopUp(false)
                navigate(0);
            }
        } catch (error) {
            console.log("Error While updating details", error);
            setLoading(false)
            setErrorMsg(error?.response?.data?.message)
            setErrorPopUp(true)
        }
    }

    useEffect(() => {
        if (data) {
            setUserDetails({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                number: data.number,
                username: data.username,
                profilePicture: data.profilePicture
            });
            setGender(data.gender || '');
            setCurrentClass(data.currentClass || '');
        }
    }, [data]);

    return (
        <>
            {
                loading && <Loading />
            }
            <ErrorPopup open={errorPopup} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />

            <div className='w-full h-auto flex flex-col gap-3 md:w-[50vw]'>
                <h1 className='font-cg-times text-2xl font-semibold'>Account Information</h1>
                <div className='w-full h-auto flex flex-col bg-gray-100 p-3 gap-3 font-cg-times text-sm rounded-md sm:text-base md:text-lg lg:text-xl md:gap-6'>
                    <div className='w-full h-auto flex flex-col gap-1'>
                        <span className='text-[#0092DB] font-semibold'>Email</span>
                        <span className=''>{data.email}</span>
                    </div>
                    <div className='w-full h-auto flex justify-between'>
                        <div className='w-full h-auto flex flex-col gap-1'>
                            <span className='text-[#0092DB] font-semibold'>Username</span>
                            <span className=''>{data.username}</span>
                        </div>
                        <div className='w-full h-auto flex flex-col gap-1'>
                            <span className='text-[#0092DB] font-semibold'>First Name</span>
                            <span className=''>{data.firstName}</span>
                        </div>
                    </div>
                    <div className='w-full h-auto flex justify-between'>
                        <div className='w-full h-auto flex flex-col gap-1'>
                            <span className='text-[#0092DB] font-semibold'>Last Name</span>
                            <span className=''>{data.lastName}</span>
                        </div>
                        <div className='w-full h-auto flex flex-col gap-1'>
                            <span className='text-[#0092DB] font-semibold'>Number</span>
                            <span className=''>{data.number ? data.number : '- - -'}</span>
                        </div>
                    </div>
                    <div className='w-full h-auto flex justify-between'>
                        <div className='w-full h-auto flex flex-col gap-1'>
                            <span className='text-[#0092DB] font-semibold'>Class</span>
                            <span className=''>{data.currentClass ? data.currentClass : '- - -'}</span>
                        </div>
                        <div className='w-full h-auto flex flex-col gap-1'>
                            <span className='text-[#0092DB] font-semibold'>Gender</span>
                            <span className=''>{data.gender ? data.gender : '- - -'} </span>
                        </div>
                    </div>
                    <div className='w-full h-auto flex items-center justify-between mt-6'>
                        <div className='w-full h-auto flex flex-col gap-1'>
                            <span onClick={() => setPasswordChangePopUp(true)} className='text-[#0092DB] underline underline-offset-4 cursor-pointer active:text-[#0092dbba] select-none lg:text-base'>Change password</span>
                        </div>
                        {
                            passwordChangePopUp && <PopupDialog state={passwordChangePopUp} title={'Change Your Password here'} content={'You can change your password below. type your current password and new password and them confirm it'} handleClose={handleClose} handleConfirm={changePassword} field={<FieldForPasswordChange passwords={passwords} setPasswords={setPasswords} />} />
                        }
                        <div className='w-full h-auto flex gap-1'>
                            <span onClick={() => setEditProfilePopUp(true)} className='bg-[#0092DB] font-semibold text-white px-4 py-1 rounded-md md:px-6 md:py-1.5 cursor-pointer active:bg-[#0092dbba] md:hover:bg-[#0092dbba] lg:text-base'>Edit Profile</span>
                        </div>
                        {
                            editProfilePopUp && <PopupDialog state={editProfilePopUp} title={'Update your account information'} content={'You can change or update your information here.'} handleClose={handleClose2} handleConfirm={updateDetails} field={<FieldForUpdateProfile userDetails={userDetails} setUserDetails={setUserDetails} gender={gender} setGender={setGender} currentClass={currentClass} setCurrentClass={setCurrentClass} image={image} setImage={setImage} />} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountInformation