import React from 'react'

function FaqStudents() {
    return (
        <div className='w-full h-auto flex flex-col'>
            <div className='w-full h-auto flex flex-col font-cg-times px-5 my-5'>
                <h1 className='text-center text-2xl my-3 md:text-4xl xl:text-5xl xl:my-6'>FAQ's For Students</h1>
            </div>
            <div className='w-full h-auto flex flex-col px-5 gap-5 xl:px-10'>
                <div className='w-full h-auto flex flex-col'>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold'>1. How do I sign up and create my account on NexMentor?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>To sign up, visit the <span className='font-bold'>NexMentor</span> website and click on the Sign Up button. Fill in the required details and create your account. Once registered, log in and complete your profile to personalize your experience</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>2. How do I find the right mentor for my needs?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>Use the <span className='font-bold'>mentor pool</span> and apply filters such as <span className='font-bold'>state-wise location , NEET score , gender preference, and budget</span> to narrow down your search. Review mentor profiles to read their biographies, check languages spoken, and other relevant details before making your selection.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>3.  How do I book a session with a mentor?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> Once you have selected a mentor, click on the <span className='font-bold'>Book Session</span> button and proceed to confirm your booking. Complete the payment through our secure gateway. The session will appear as <span className='font-bold'>Pending</span> until the mentor approves it.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>4. What happens after I book a session?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> After booking, the mentor will review and approve your session within <span className='font-bold'>24 hours</span>. Once approved, the session status changes to <span className='font-bold'>active</span>, and you’ll be notified via email and on the platform. You can then use the built-in chat system to finalize the session date and me.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>5. How do I schedule the session with the mentor?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> Use the chat system to discuss and agree on the date and me that works for both you and the mentor. The mentor will send a <span className='font-bold'>Google Meet link</span> or any other video conferencing link before the session starts.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>6. What should I do on the day of the session?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>On the day of the session, click the provided <span className='font-bold'>Google Meet link</span> to join the video call. Make sure to log in a few minutes early, be prepared with your questions or topics, and actively engage in the session.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>7. How do I know when the session is completed?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>After the session ends, the mentor will update the session status to <span className='font-bold'>Completed</span>. You’ll see this change in your account, and you will have the op on to rate the session with a 5-star rating and provide detailed feedback.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>8. Can I get a refund if I cancel my session?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>Yes, if you cancel your session before the mentor approves it, you are eligible for a <span className='font-bold'>Full Refund</span>. Once approved, cancella ons do not qualify for a refund. For more details, check our <span className='font-bold'>Refund Policy.</span></p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>9. How often should I book sessions to stay on track?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>It’s recommended to book a session once every month to maintain consistent progress. This will allow you to follow a structured plan and benefit from monthly guidance and tips provided by your mentor.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>10. What kind of feedback can I give after a session?</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3 mb-10'> After the session is completed, you can rate your experience out of 5 stars and provide additional detailed feedback. This helps NexMentor improve its services and assists other students in choosing the right mentor</p>
                </div>
            </div>
        </div>
    )
}

export default FaqStudents