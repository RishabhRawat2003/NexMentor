import React from 'react'

function AboutUs() {
    // <span className='font-bold'>NexMentor</span>
    return (
        <div className='w-full h-auto flex flex-col'>
            <div className='w-full h-auto flex flex-col font-cg-times px-5 my-5'>
                <h1 className='text-center text-2xl my-3 md:text-4xl xl:text-5xl xl:my-6'>About Us</h1>
            </div>
            <div className='w-full h-auto flex flex-col px-5 gap-5 xl:px-10'>
                <p className='text-sm sm:text-sm md:text-base lg:text-lg '> At <span className='font-bold'>NexMentor</span>, we believe that success in NEET isn’t just about having the best study material—it’s about having the right mentorship to translate knowledge into meaningful results. While online coaching platforms provide excellent content, they often lack the personalized guidance needed to truly elevate a student’s preparation and confidence.</p>
                <div className='w-full h-auto flex flex-col'>
                    <h1 className='text-xl xl:text-2xl font-bold my-5'>Why NexMentor?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> NexMentor bridges this gap by connecting NEET aspirants with recent toppers who have firsthand experience overcoming the challenges of the exam. Our mentors don’t just provide advice; they listen, understand, and craft customized strategies that empower students to excel.</p>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> We recognize that every student’s journey is unique. That’s why we are dedicated to personalized mentorship, offering:</p>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li><span className='font-bold'>One-on-one guidance:</span> Support tailored to individual strengths and areas for improvement.</li>
                        <li><span className='font-bold'>Customizable roadmaps:</span> Personalized plans to optimize preparation and maximize effectiveness.</li>
                        <li><span className='font-bold'>Ongoing motivation:</span> Mentors who have overcome similar challenges to keep students inspired and on track.</li>
                    </ul>
                    <h1 className='text-xl xl:text-2xl font-bold my-5'>What Sets Us Apart?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> Unlike traditional coaching programs, <span className='font-bold'>NexMentor</span> focuses on mentorship that builds confidence, clarity, and resilience in students. Our mission is to ensure no student feels lost or overwhelmed on their path to success</p>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> With <span className='font-bold'>NexMentor</span>, students gain more than academic guidance—they gain a partner deeply invested in their journey. Our mentors are more than subject experts; they are inspiring role models who understand the dedication and effort required to succeed in NEET</p>
                    <h1 className='text-xl xl:text-2xl font-bold my-5'>Join Us Today!</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> We are committed to fostering an inclusive environment where every student feels valued and empowered to achieve their best. Take the first step toward your NEET success by joining <span className='font-bold'>NexMentor</span> today!</p>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-6 font-bold'>NexMentor: Your Mentor. Your Guide. Your Path to NEET Success</p>
                </div>
            </div>
        </div>
    )
}

export default AboutUs