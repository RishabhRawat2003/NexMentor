import React, { useEffect, useState } from 'react'
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa";
import { Range } from "react-range";
import axios from 'axios'
import Loading from './utils/Loading'
import { NavLink } from 'react-router-dom';
import ErrorPopup from './utils/ErrorPopUp';
import { StarRating } from './utils/StarRating';

function DualRangeSlider({ min, max, step2, onRangeChange }) {
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);

    const handleRangeChange = (values) => {
        setMinValue(values[0]);
        setMaxValue(values[1]);
        onRangeChange(values[0], values[1]); // Notify parent component with the new range values
    };

    const renderScale = () => {
        const scaleMarks = [];
        const step = step2;
        for (let i = min; i <= max; i += step) {
            scaleMarks.push(i);
        }
        return scaleMarks.map((mark) => (
            <div
                key={mark}
                className="absolute bottom-6 text-xs"
                style={{
                    left: `${((mark - min) / (max - min)) * 100}%`,
                    transform: "translateX(-50%)",
                }}
            >
                {mark}
            </div>
        ));
    };

    return (
        <div className="w-full p-2 relative pt-5">
            <div className="relative w-full h-8">
                <div className="absolute w-full h-2 bg-gray-300 rounded-lg mb-4 top-4">
                    {renderScale()}
                </div>
            </div>

            <Range
                step={50}
                min={min}
                max={max}
                values={[minValue, maxValue]}
                onChange={handleRangeChange}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        className="w-full h-2 bg-gray-300 rounded-lg relative"
                        style={{ marginTop: "-16px" }} // Adjust for overlap
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-green-400 rounded-lg"
                            style={{
                                width: `${((maxValue - minValue) / (max - min)) * 100}%`,
                                left: `${((minValue - min) / (max - min)) * 100}%`,
                            }}
                        />
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div {...props} className="w-6 h-6 bg-green-400 rounded-full" />
                )}
            />
        </div>
    );
}

function SearchMentor() {
    const [formDetails, setFormDetails] = useState({
        username: "",
        neetExamYear: "",
        minBudget: 100,
        maxBudget: 500,
        city: "",
        state: "",
        minNeetScore: 500,
        maxNeetScore: 720,
        gender: "",
        neetAttempts: "",
    });
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUser] = useState([])
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalMentors: 0,
    });
    const [errorPopUp, setErrorPopUp] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const indianStatesAndUTs = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands - UT",
        "Chandigarh - UT",
        "Dadra and Nagar Haveli and Daman and Diu - UT",
        "Delhi - UT",
        "Jammu and Kashmir - UT",
        "Ladakh - UT",
        "Lakshadweep - UT",
        "Puducherry - UT"
    ];

    const handleChange = (field, value) => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const handleBudgetChange = (min, max) => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            minBudget: min,
            maxBudget: max,
        }));
    };

    const handleScoreChange = (min, max) => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            minNeetScore: min,
            maxNeetScore: max,
        }));
    };

    async function fetchUsers(page = 1) {
        try {
            setLoading(true)
            const response = await axios.get(`/api/v1/mentors/all-mentors?page=${page}`, formDetails)
            if (response.data.statusCode === 200) {
                setUser(response.data.data.data)
                setPagination(response.data.data.pagination)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching Users", error);
            setLoading(false)
            setErrorMsg(error.response?.data?.message || "An error occurred");
            setErrorPopUp(true);
        }
    }

    function handleCloseErrorPopUp() {
        setErrorPopUp(false)
    }

    async function searchMentor() {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/mentors/search-mentor", formDetails)
            if (response.data.statusCode === 200) {
                setUser(response.data.data)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while searching mentor", error);
            setErrorMsg(error.response?.data?.message || "An error occurred");
            setErrorPopUp(true);
            setLoading(false);
            setUser([])
        }
    }

    const goToNextPage = () => {
        if (pagination.currentPage < pagination.totalPages) {
            setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
            }));
        }
    };

    const goToPreviousPage = () => {
        if (pagination.currentPage > 1) {
            setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1,
            }));
        }
    };

    useEffect(() => {
        fetchUsers(pagination.currentPage)
    }, [pagination.currentPage])

    return (
        <>
            {
                loading && <Loading />
            }
            <ErrorPopup open={errorPopUp} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />

            <div className='w-full h-auto flex flex-col'>
                <div className='w-full h-auto flex p-5 justify-between'>
                    <div className='w-full h-auto flex flex-col lg:w-[60vw] xl:w-[70vw]'>
                        <div className='w-full h-auto shadow-custom  px-6 pt-4 border-[1px] flex flex-col rounded-xl lg:py-4 '>
                            <div className='w-full h-auto flex flex-col gap-3 sm:flex-row sm:items-center'>
                                <input type="text" placeholder='Search by ID' value={formDetails.username} onChange={(e) => handleChange("username", e.target.value)} className='w-full h-9 border-[1px] border-gray-400 px-2 py-1 rounded-md outline-none sm:h-11' />
                                <div className='bg-white w-full h-9 px-2 py-1 flex justify-center items-center rounded-md border-[1px] border-gray-400 sm:h-11 sm:w-[60vw] lg:w-96'>
                                    <select className=' w-full bg-white outline-none rounded-md'
                                        placeholder='Select Year'
                                        value={formDetails.neetExamYear}
                                        onChange={(e) => handleChange("neetExamYear", e.target.value)}
                                    >
                                        <option value="" disabled hidden>
                                            Neet Exam Year
                                        </option>
                                        <option value="2020">2020</option>
                                        <option value="2021">2021</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>
                                <div onClick={searchMentor} className='w-full h-auto flex justify-center items-center bg-blue-400 py-1 text-white font-cg-times rounded-md active:bg-blue-500 sm:w-80 sm:h-9 cursor-pointer'>
                                    Search
                                </div>
                            </div>
                            {
                                open
                                    ? null
                                    : <div className='w-full h-auto flex justify-center items-center mt-3 lg:hidden'>
                                        <FaAngleDown onClick={() => setOpen(true)} size={20} className='animate-bounce' />
                                    </div>
                            }
                            {
                                open
                                    ? <div className='w-full h-auto flex flex-col my-5 font-cg-times'>
                                        <div className='w-full h-auto flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3'>
                                            <div className='w-full h-auto flex flex-col gap-2'>
                                                <h1 className='text-sm font-semibold'>Average Budget</h1>
                                                <DualRangeSlider min={100} max={500} step2={100} onRangeChange={handleBudgetChange} />
                                            </div>
                                            <div className='w-full h-auto flex flex-col gap-2'>
                                                <h1 className='text-sm font-semibold'>Location</h1>
                                                <div className='bg-white w-full h-9 px-2 py-1 flex justify-center items-center rounded-md border-[1px] border-gray-400'>
                                                    <select className=' w-full bg-white outline-none rounded-md'
                                                        placeholder='Select State'
                                                        value={formDetails.state}
                                                        onChange={(e) => handleChange("state", e.target.value)}
                                                    >
                                                        <option value="" disabled hidden>
                                                            Select State
                                                        </option>
                                                        {
                                                            indianStatesAndUTs.map((item, index) => (
                                                                <option key={index} value={item}>{item}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w-full h-auto flex flex-col gap-2 my-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3'>
                                            <div className='w-full h-auto flex flex-col gap-2'>
                                                <h1 className='text-sm font-semibold'>Score</h1>
                                                <DualRangeSlider min={500} max={720} step2={50} onRangeChange={handleScoreChange} />
                                            </div>
                                            <div className='w-full h-auto flex flex-col gap-3 justify-between my-3 sm:flex-row'>
                                                <div className='bg-white w-full h-9 px-2 py-1 flex justify-center items-center rounded-md border-[1px] border-gray-400'>
                                                    <select className=' w-full bg-white outline-none rounded-md'
                                                        placeholder='Select a Gender'
                                                        value={formDetails.gender}
                                                        onChange={(e) => handleChange("gender", e.target.value)}
                                                    >
                                                        <option value="" disabled hidden>
                                                            Select a Gender
                                                        </option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Others">Others</option>
                                                    </select>
                                                </div>
                                                <div className='bg-white w-full h-9 px-2 py-1 flex justify-center items-center rounded-md border-[1px] border-gray-400'>
                                                    <select className=' w-full bg-white outline-none rounded-md'
                                                        placeholder='Select Neet Attempts'
                                                        value={formDetails.neetAttempts}
                                                        onChange={(e) => handleChange("neetAttempts", e.target.value)}
                                                    >
                                                        <option value="" disabled hidden>
                                                            Neet Attempts
                                                        </option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                            }
                            {
                                open && <div className='w-full h-auto flex justify-center items-center mb-3'>
                                    <FaAngleUp onClick={() => setOpen(false)} size={20} className='' />
                                </div>
                            }
                        </div>
                        <div className='w-full h-auto flex flex-wrap gap-3 py-6 justify-center mt-5 sm:items-start xl:gap-8'>
                            {
                                users.length > 0
                                    ? users.map((user, index) => (
                                        <div key={index} className='w-72 h-auto shadow-custom  flex flex-col rounded-md font-cg-times'>
                                            <img src={user.profilePicture} alt="profile Picture" className='w-full h-48 object-cover rounded-t-md lg:h-56' />
                                            <div className='w-full h-auto flex items-center justify-between px-2 font-cg-times mt-3 text-lg font-semibold md:text-xl'>
                                                <span>{user.firstName} {user.lastName}</span>
                                                <div className='flex items-center'>
                                                    <StarRating
                                                        rating={
                                                            user.feedBack.length > 0
                                                                ? Math.round(user.feedBack.reduce((acc, item) => acc + item.rating, 0) / user.feedBack.length)
                                                                : user.neetScore >= 681 ? 5 : user.neetScore >= 641 && user.neetScore >= 680 ? 4 : 3
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <span className='px-2 text-gray-500 text-sm md:text-base'>{user.institute}</span>
                                            <span className='px-2 text-gray-500 text-sm md:text-base'>Neet Score : {user.neetScore}</span>
                                            <NavLink to={`/single-mentor/${user._id}`} className='bg-[#0092DB] text-white text-center mt-3 py-1.5 rounded-x-sm rounded-b-md cursor-pointer active:bg-[#0092dbc3] md:hover:bg-[#0092dbc3]'>Book a Session</NavLink>
                                        </div>
                                    ))
                                    : <p className='font-cg-times font-semibold h-80 flex justify-center items-center'>No Mentors Found</p>
                            }
                        </div>
                        <div className="w-full h-auto flex justify-center items-center my-4">
                            <button
                                onClick={goToPreviousPage}
                                disabled={pagination.currentPage === 1}
                                className={`px-4 py-2 mx-2 rounded-md text-white transition duration-300 
            ${pagination.currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                Previous
                            </button>
                            <span className="mx-4 text-lg font-medium text-gray-700">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className={`px-4 py-2 mx-2 rounded-md text-white transition duration-300 
            ${pagination.currentPage === pagination.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <div className='w-full h-[400px] hidden lg:w-[35vw] lg:flex xl:w-[26vw] 2xl:h-[400px]'>
                        <div className='w-full h-auto flex lg:shadow-custom  lg:border-[1px] lg:rounded-xl lg:p-5 lg:font-cg-times lg:flex-col'>
                            <div className='w-full h-auto flex flex-col gap-2'>
                                <h1 className='text-xl font-semibold'>Average Budget</h1>
                                <DualRangeSlider min={100} max={500} step2={100} onRangeChange={handleBudgetChange} />
                            </div>
                            <div className='w-full h-auto flex flex-col gap-2 my-4'>
                                <h1 className='text-xl font-semibold'>Location</h1>
                                <div className='bg-white w-full h-9 px-2 py-1 flex justify-center items-center rounded-md border-[1px] border-gray-400'>
                                    <select className=' w-full bg-white outline-none rounded-md'
                                        placeholder='Select State'
                                        value={formDetails.state}
                                        onChange={(e) => handleChange("state", e.target.value)}
                                    >
                                        <option value="" disabled hidden>
                                            Select State
                                        </option>
                                        {
                                            indianStatesAndUTs.map((item, index) => (
                                                <option key={index} value={item}>{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='w-full h-auto flex flex-col gap-2'>
                                <h1 className='text-xl font-semibold'>Score</h1>
                                <DualRangeSlider min={500} max={720} step2={50} onRangeChange={handleScoreChange} />
                            </div>
                            <div className='w-full h-auto flex flex-row gap-3 justify-between my-4'>
                                <div className='bg-white w-full h-9 px-2 py-1 flex justify-center items-center rounded-md border-[1px] border-gray-400'>
                                    <select className=' w-full bg-white outline-none rounded-md'
                                        placeholder='Select a Gender'
                                        value={formDetails.gender}
                                        onChange={(e) => handleChange("gender", e.target.value)}
                                    >
                                        <option value="" disabled hidden>
                                            Select a Gender
                                        </option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div className='bg-white w-full h-9 px-2 py-1 flex justify-center items-center rounded-md border-[1px] border-gray-400'>
                                    <select className=' w-full bg-white outline-none rounded-md'
                                        placeholder='Select Neet Attempts'
                                        value={formDetails.neetAttempts}
                                        onChange={(e) => handleChange("neetAttempts", e.target.value)}
                                    >
                                        <option value="" disabled hidden>
                                            Neet Attempts
                                        </option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchMentor