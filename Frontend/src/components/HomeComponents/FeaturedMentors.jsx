import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { StarRating } from '../utils/StarRating'

function FeaturedMentors() {
    const [featuredMentors, setFeaturedMentors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Function to calculate the mentor's rating
    const calculateRating = (feedback, neetScore) => {
        if (feedback.length > 0) {
            const avgRating = Math.round(feedback.reduce((acc, item) => acc + item.rating, 0) / feedback.length);
            return avgRating;
        } else {
            if (neetScore >= 681) return 5;
            if (neetScore >= 641 && neetScore <= 680) return 4;
            return 3;
        }
    }

    // Function to fetch featured mentors
    async function getFeaturedMentors() {
        try {
            const response = await axios.post('/api/v1/admin/get-featured-mentors')

            if (response.data.statusCode === 200) {
                setFeaturedMentors(response.data.data)
            }
        } catch (error) {
            setError("Error while fetching featured mentors. Please try again later.")
            console.log("Error while fetching featured mentors", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getFeaturedMentors()
    }, [])

    if (loading) {
        return <p className='text-center font-cg-times font-semibold text-xl'>Loading featured mentors...</p>
    }

    return (
        <div className='w-full h-auto flex flex-col my-10 px-2'>
            <h1 className='w-full h-auto font-semibold text-sm font-cg-times sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center'>
                Pick <span className='text-[#0092DB]'>Top Skilled Mentors</span> Now from the Featured List of Mentors
            </h1>

            <div className='w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-7 md:mt-14 xl:gap-10 xl:px-20'>
                {
                    error ? (
                        <p className='font-cg-times font-semibold h-80 flex justify-center items-center'>{error}</p>
                    ) : (
                        featuredMentors.length > 0
                            ? featuredMentors.map((user, index) => (
                                <div key={index} className='w-full h-auto shadow-custom flex flex-col rounded-md font-cg-times'>
                                    <img src={user.profilePicture} alt="profile Picture" className='w-full h-48 object-cover rounded-t-md lg:h-56' loading="lazy" />
                                    <div className='w-full h-auto flex items-center justify-between px-2 font-cg-times mt-3 text-lg font-semibold md:text-xl'>
                                        <span>{user.firstName} {user.lastName}</span>
                                        <div className='flex items-center'>
                                            <StarRating rating={calculateRating(user.feedBack, user.neetScore)} />
                                        </div>
                                    </div>
                                    <span className='px-2 text-gray-500 text-sm md:text-base'>{user.institute}</span>
                                    <span className='px-2 text-gray-500 text-sm md:text-base'>Neet Score : {user.neetScore}</span>
                                    <NavLink to={`/single-mentor/${user._id}`} className='bg-[#0092DB] text-white text-center mt-3 py-1.5 rounded-x-sm rounded-b-md cursor-pointer active:bg-[#0092dbc3] md:hover:bg-[#0092dbc3]'>
                                        Book a Session
                                    </NavLink>
                                </div>
                            ))
                            : <p className='font-cg-times font-semibold h-80 flex justify-center items-center'>No Mentors Found</p>
                    )
                }
            </div>

            <div className='w-full h-auto flex flex-col mt-5 md:mt-10 justify-center items-center'>
                <NavLink to='/search-mentor' className='border border-[#0092DB] text-[#0092DB] px-6 py-2 rounded-md'>
                    Browse All Mentors
                </NavLink>
            </div>
        </div>
    )
}

export default FeaturedMentors
