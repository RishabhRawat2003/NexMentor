import React from 'react'
import { useLocation } from 'react-router-dom'


function SingleBlogPage() {
    const location = useLocation()
    const { blog } = location.state || {}

    return (
        <div className='w-full h-auto flex flex-col my-5 xl:my-10 px-5 md:px-20 xl:px-40 2xl:px-60'>
            <div className='w-full h-auto flex justify-center items-center'>
                <img src={blog?.image} alt="blog image" className='w-full rounded-lg md:w-[50%] xl:w-[70%]' />
            </div>
            <h1 className='my-5 text-2xl font-semibold md:text-3xl xl:text-4xl md:my-10'>{blog.title}</h1>
            <p className='text-sm md:text-base' style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
    )
}

export default SingleBlogPage