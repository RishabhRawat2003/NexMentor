import React from 'react'

function RefundPolicy() {
    return (
        <div className='w-full h-auto flex flex-col'>
            <div className='w-full h-auto flex flex-col font-cg-times px-5 my-5'>
                <h1 className='text-center text-2xl my-3 md:text-4xl xl:text-5xl xl:my-6'>Refund Policy</h1>
            </div>
            <div className='w-full h-auto flex flex-col px-5 gap-5 xl:px-10'>
                <p className='text-sm sm:text-sm md:text-base lg:text-lg '> Welcome to NexMentor! We are committed to ensuring a seamless mentorship experience for both students and
                    mentors. Please review our comprehensive refund policy below</p>
                <div className='w-full h-auto flex flex-col'>
                    <h1 className='text-xl xl:text-2xl font-bold my-5'>For Students</h1>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold'>1. Cancellation Before Mentor Approval</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>Students may cancel their session requests before the mentor approves by emailing us at <a href="mailto:" ><span className='text-blue-500 underline'>support@nexmentor.com</span></a> this case:</p>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>A full refund will be issued, and the amount will be credited back to the original payment method.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>2. Cancellation After Mentor Approval</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>Once the mentor has approved the session request:</p>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Students will not be eligible for a refund if they choose to cancel.</li>
                        <li>Exceptions may be considered in cases of emergencies; please contact us for review</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>3. Mentor Approval and Unavailability</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Mentors have 24 hours to approve a session request. If the mentor does not approve within this timeframe, the session will be automatically canceled by the admin.</li>
                        <li>In such cases, students will receive a full refund, credited back to their original payment method. Students can rebook a session with another mentor of their choice.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>4. Mentor Becomes Unavailable</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>If a mentor becomes unavailable after approving a session but before the scheduled date, the admin will assist the student in selecting a new mentor of their choice to reschedule the session. No refund will be issued unless the student opts not to proceed with a replacement mentor.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>5. Cancellation Process</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Students must email their cancella on requests to <a href="mailto:" ><span className='text-blue-500 underline'>support@nexmentor.com</span></a> with the subject line: “Session Cancellation Request.”</li>
                        <li>Include session details such as booking ID, mentor name, and session date to facilitate prompt processing.</li>
                        <li>Refunds will be processed within 7-10 business days from the date of refund approval.</li>
                    </ul>
                    <h1 className='text-xl xl:text-2xl font-bold my-5'>For Mentors</h1>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>1. Application Fee Refund</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>The application fee of ₹149 is non-refundable as it covers operational costs, including payment gateway charges, document verification, interview and assessment expenses, administrative tasks, and training material development.</p>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>By applying, mentors acknowledge and agree to these terms.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>2. Session Acceptance</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>If a mentor is unable to accept a session request within the 24-hour approval window, the admin will cancel the session on behalf of the mentor.</li>
                        <li>In such cases, the student will receive a full refund, and mentors will not face penalties for cancellations due to unavailability.</li>
                        <li>If mentors frequently fail to accept session requests without valid reasons, their account may be deactivated by the admin.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-6'>General Terms</h1>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Refunds (where applicable) will be processed within 7-10 business days from the date of refund approval.</li>
                        <li>Refunds will be credited back to the original payment method used for the transaction, unless otherwise specified.</li>
                        <li>Force Majeure Clause: NexMentor will not be liable for refunds or cancellations due to events beyond reasonable control, such as natural disasters, power outages, or other unforeseen circumstances.</li>
                        <li>NexMentor reserves the right to amend this refund policy at any me. Significant updates will be communicated via email and reflected on this page.</li>
                        <li>Dispute Resolutioon: Any disputes related to refunds or cancellations will be managed through mediation or arbitration as determined by NexMentor.</li>
                    </ul>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> For further inquiries or support, please contact us at <a href="mailto:" ><span className='text-blue-500 underline'>support@nexmentor.com</span></a></p>
                </div>
            </div>
        </div>
    )
}

export default RefundPolicy