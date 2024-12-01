import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';


function Blogs() {
    const [totalBlogs, setTotalBlogs] = useState([]);

    // Fetch blogs asynchronously
    async function getBlogs() {
        try {
            const response = await axios.post('/api/v1/admin/get-blogs');
            if (response.data.statusCode === 200) {
                setTotalBlogs(response.data.data);
            }
        } catch (error) {
            console.error("Error while getting blog", error);
        }
    }

    // Call getBlogs only once after the component mounts
    useEffect(() => {
        getBlogs();
    }, []);

    return (
        <div className="w-full h-auto flex flex-col mb-10 lg:mb-20">
            <h1 className="text-center font-semibold font-cg-times text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Our Recent Blogs
            </h1>
            <p className="px-3 text-[#4F4F4F] font-cg-times text-center text-xs mt-5 md:text-sm lg:px-10 lg:text-lg xl:px-32">
            Dive into our latest blogs to supercharge your NEET preparation! From expert tips and success stories to proven strategies, we’ve got you covered.Learn how to tackle challenges, stay motivated, and achieve your dream score.Stay updated with insights that make a real difference in your journey!
            </p>
            <div className="disable-scrollbar w-full h-auto py-10 md:py-20 flex gap-5 px-5 md:px-10 overflow-x-auto lg:gap-8 xl:px-20">
                {totalBlogs?.map((blog, index) => (
                    <div
                        key={index}
                        className="min-w-[90%] sm:min-w-[45%] lg:min-w-[30%] xl:min-w-[25%] shadow-custom h-auto p-4 border justify-between rounded-lg bg-white flex flex-col"
                    >
                        <div className="w-full h-auto flex flex-col">
                            <img
                                src={blog.image}
                                alt={`Blog image for ${blog.title}`}
                                className="w-full h-40 object-cover mx-auto border border-gray-400"
                                loading="lazy" // Lazy load images
                            />
                            <span className="mx-auto lg:text-lg font-semibold mt-3">{blog.title.length > 30 ? `${blog.title.slice(0,60)}...` : blog.title}</span>
                            <p className="w-full h-auto text-center text-sm mt-2 text-gray-400">
                                {blog.content.length > 150 ? `${blog.content.slice(0, 150)}...` : blog.content}
                            </p>
                        </div>
                        <p className="flex justify-between items-center mt-3">
                            <NavLink state={{ blog }} to='/single-blog' className="text-blue-500 font-cg-times md:hover:text-blue-600 active:text-blue-600 cursor-pointer hover:underline active:underline underline-offset-2">
                                View
                            </NavLink>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Blogs;
