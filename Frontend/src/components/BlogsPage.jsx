import React, { useEffect, useState } from 'react'
import Image1 from './images/BlogsPage/landingimage1.webp'
import Image2 from './images/BlogsPage/landingimage2.webp'
import axios from 'axios'
import Loading from './utils/Loading'
import { NavLink } from 'react-router-dom'

function BlogsPage() {
    const [totalBlogs, setTotalBlogs] = useState([])
    const [loading, setLoading] = useState(false)

    async function getBlogs() {
        try {
            setLoading(true)
            const response = await axios.post('/api/v1/admin/get-blogs')

            if (response.data.statusCode === 200) {
                setLoading(false)
                setTotalBlogs(response.data.data);
            }

        } catch (error) {
            console.log("Error while getting blog", error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getBlogs()
    }, [])

    return (
        <>
            {
                loading && <Loading />
            }
            <div className='w-full h-auto flex flex-col gap-10 my-10 lg:px-10 xl:px-20'>
                <div className='w-full h-auto flex flex-col px-5 gap-5 sm:w-[70%] sm:mx-auto md:w-full md:flex-row'>
                    <div className='w-full h-auto flex flex-col gap-4 md:w-[50%]'>
                        <div className='w-full h-auto flex flex-col font-[600] text-2xl md:text-3xl lg:text-4xl xl:text-5xl xl:mt-10 2xl:text-6xl'>
                            <h1><span className='text-[#287EFF]'>NexMentor Blogs :</span> </h1>
                            <h1>Your NEET Success Guide</h1>
                        </div>
                        <p className='text-sm md:mt-5 md:text-base xl:text-lg text-[#595959]'>Navigate your NEET preparation with expert advice, practical tips, and motivational success stories. Our blog is packed with insights from mentors and top scorers to help you stay on track and reach your goals. Empower yourself with proven strategies and boost your confidence for exam day!</p>
                        <div className='w-full h-auto flex mt-4 items-center'>
                            <input type="text" placeholder='Subscribe to our Newsletter' className='border-2 border-[#287EFF] rounded-l-lg px-3 py-2 md:w-60 xl:w-80 xl:py-3 outline-none' />
                            <span className='px-3 bg-[#287EFF] text-white border-2 border-l-0 border-[#287EFF] py-2 rounded-r-lg xl:py-3 md:px-4 xl:px-5 cursor-pointer md:hover:bg-[#2069d5]'>Subsribe</span>
                        </div>
                    </div>
                    <div className='w-full h-[400px] relative md:w-[50%] xl:w-[40%]'>
                        <img src={Image1} alt="image1" className='w-64 ml-auto lg:w-72 xl:w-80' />
                        <img src={Image2} alt="image1" className='w-64 absolute bottom-0 lg:w-72 xl:w-80' />
                    </div>
                </div>
                <div className='w-full h-auto flex flex-col gap-5 xl:gap-10'>
                    <h1 className='text-center font-semibold text-3xl text-[#287EFF] font-cg-times lg:text-5xl'>All Blogs</h1>
                    <div className='w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center'>
                        {totalBlogs?.map((blog, index) => (
                            <div
                                key={index}
                                className="w-80 shadow-custom h-auto p-4 border justify-between rounded-lg bg-white flex flex-col"
                            >
                                <div className="w-full h-auto flex flex-col">
                                    <img
                                        src={blog.image}
                                        alt={`Blog image for ${blog.title}`}
                                        className="w-full h-40 object-cover mx-auto border border-gray-400"
                                        loading="lazy" // Lazy load images
                                    />
                                    <span className="mx-auto lg:text-lg font-semibold mt-3">{blog.title.slice(0,30)}</span>
                                    <p className="w-full h-auto text-sm mt-2 text-gray-400">
                                        {blog.content.length > 180 ? `${blog.content.slice(0, 170)}...` : blog.content}
                                    </p>
                                </div>
                                <p className="flex justify-between items-center mt-3">
                                    <NavLink state={{blog}} to='/single-blog' className="text-blue-500 font-cg-times md:hover:text-blue-600 active:text-blue-600 cursor-pointer hover:underline active:underline underline-offset-2">
                                        View
                                    </NavLink>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogsPage