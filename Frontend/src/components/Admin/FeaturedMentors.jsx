import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios';
import { StarRating } from '../utils/StarRating';
import Loading from '../utils/Loading';
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function FeaturedMentors() {
    const [localSidebarState, setLocalSidebarState] = useState(false)
    const [loading, setLoading] = useState(false)
    const [featuredMentors, setFeaturedMentors] = useState([])

    const navigate = useNavigate()

    function handleStateChange() {
        setLocalSidebarState((prev) => !prev)
    }

    function getData(e) {
        setFeaturedMentors(e.featuredMentors)
    }

    async function removeMentorFromFeatured(id) {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/remove-feature-mentor", { mentorId: id })
            if (response.data.statusCode === 200) {
                navigate(0)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while removing mentor from featured List ", error);
            setLoading(false)
        }
    }

    return (
        <>
            {
                loading && <Loading />
            }
            <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
                <Header getData={getData} handleStateChange={handleStateChange} />
                <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-auto flex flex-col py-6 bg-white xl:px-5`}>
                    <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                        <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Total Featured Mentors</span>
                    </div>
                    <table className="min-w-full overflow-x-scroll mt-4">
                        <thead className="bg-[#9EDFFF63] border-b border-gray-300">
                            <tr>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    S.No
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    MentorId
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    State
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    City
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ratings
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Featured
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {featuredMentors.map((item, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {index + 1}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {item?.mentorId}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {item?.email}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {item?.state}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {item?.city}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        <StarRating
                                            rating={
                                                item?.feedBack.length > 0
                                                    ? Math.round(item.feedBack.reduce((acc, item) => acc + item.rating, 0) / item.feedBack.length)
                                                    : 0
                                            }
                                        />
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center flex justify-center">
                                        <FaStar size={20} onClick={() => removeMentorFromFeatured(item?.id)} className='text-yellow-500 cursor-pointer ' />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default FeaturedMentors