import React from 'react'

function HowItWorks() {
    return (
        <div className='w-full h-auto flex flex-col'>
            <div className='w-full h-auto flex flex-col font-cg-times px-5 my-5'>
                <h1 className='text-center text-2xl my-3 md:text-4xl xl:text-5xl xl:my-6'>How It Work's</h1>
            </div>
            <div className='w-full h-auto flex flex-col px-5 gap-5 xl:px-10'>
                <p className='text-sm sm:text-sm md:text-base lg:text-lg'><span className='font-bold'>NexMentor</span> makes it easy for you to connect with experienced mentors who can help you excel in your exam preparation. Follow these steps to start your mentorship journey:</p>
                <div className='w-full h-auto flex flex-col'>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold'>1. Sign Up & Create Your Account</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Visit the <span className='font-bold'>NexMentor</span> website and click on the Sign Up button.</li>
                        <li>Register by filling out the required information and creating your account.</li>
                        <li>Once signed up, log in and complete your profile to personalize your experience.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>2. Search & Choose Your Mentor</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Explore the <span className='font-bold'>Mentor pool</span> and use advanced filters to find the right mentor for your needs. Filters include:</li>
                        <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3 px-6'>
                            <li> <span className='font-bold'>State wise</span> location</li>
                            <li> NEET score (or exam-specific scores)</li>
                            <li> Gender (male or female)</li>
                            <li> Budget preferences</li>
                        </ul>
                        <li>Review mentor profiles to check their <span className='font-bold'>biographies</span>, languages spoken, and other relevant details</li>
                        <li>Select your preferred mentor based on your search criteria and available information.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>3. Book a Session</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Once you’ve selected your mentor, click on the <span className='font-bold'>Book Session</span> button to initiate the booking process.</li>
                        <li>Confirm your session and make the payment through our secure payment gateway.</li>
                        <li>The session will appear in your account as pending until the mentor approves it</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>4. Mentor Approval & Session Activation</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>The mentor will review and approve your session request within 24 hours.</li>
                        <li>Once approved, the status will change to active, and you’ll be notified via email and within the platform.</li>
                        <li>An in-built chat system will activate, allowing you and the mentor to communicate directly and discuss the most suitable date and me for the session based on both of your availabilities.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>5. Scheduling the Session</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Use the chat system to finalize a convenient date and me for your session.</li>
                        <li>The mentor will share a <span className='font-bold'>Google Meet link</span> or any other agreed-upon video conferencing link prior to the session.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>6. Attend the Session</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>On the day of the session, click on the provided Google Meet link to join the scheduled video call.</li>
                        <li>Participate actively, ask questions, and make the most of your mentorship session.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>7. Post-Session Completion & Feedback</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li> After the session concludes, the mentor will update the session status to <span className='font-bold'>complete</span>.</li>
                        <li>You will see the status change to <span className='font-bold'>complete</span> in your account.</li>
                        <li>Rate your session by giving feedback out of 5 stars. You can also click on a link to provide a more detailed review to help improve the experience for other students.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>Tips for a Great Mentorship Experience:</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li><span className='font-bold'>Be Prepared: </span>  Write down any questions or topics you want to discuss during your session.</li>
                        <li><span className='font-bold'>Stay On Time: </span> Log in a few minutes early to ensure everything is set up for your meeting.</li>
                        <li><span className='font-bold'>Engage Fully: </span> Take notes, ask follow-up questions, and make sure you understand the mentor’s advice.</li>
                        <li><span className='font-bold'>Book Monthly Sessions: </span> To maintain consistent progress, it’s best to book a mentorship session once every month. Regular monthly check-ins will help you stay aligned with your study plan and achieve your targets.</li>
                        <li><span className='font-bold'>Follow Monthly Guidance: </span> Ask your mentor to provide specific monthly guidance and recommendations. This will help you follow a structured plan and make the most of your learning.</li>
                    </ul>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg'><span className='font-bold'>NexMentor</span> connects you with mentors who have been through the same challenges and can provide personalized insights and guidance. Start your mentorship journey today and take a step closer to achieving your goals!</p>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-6'>For any questions or support, contact us at: <a href="mailto:" className='text-blue-500 underline'>support@nexmentor.com</a></p>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks