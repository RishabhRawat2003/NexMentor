import React from 'react'

function PrivacyPolicy() {
    return (
        <div className='w-full h-auto flex flex-col'>
            <div className='w-full h-auto flex flex-col font-cg-times px-5 my-5'>
                <h1 className='text-center text-2xl my-3 md:text-4xl xl:text-5xl xl:my-6'>Privacy Policy</h1>
            </div>
            <div className='w-full h-auto flex flex-col px-5 gap-5 xl:px-10'>
                <p className='text-sm sm:text-sm md:text-base lg:text-lg '>At <span className='font-bold'>NexMentor</span> (“we,” “our,” or “us”), we are committed to safeguarding your privacy. This Privacy Policy explains how
                    we collect, use, share, and protect your personal information when you use our platform. By accessing or using 
                    <span className='font-bold'> NexMentor</span>, you agree to the practices described in this policy.</p>
                <div className='w-full h-auto flex flex-col'>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold'>1. Information We Collect</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>We may collect and process the following types of information:</p>
                    <h2 className='text-sm sm:text-sm md:text-base lg:text-lg font-semibold'>a. Personal Information</h2>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Payment details (if applicable)</li>
                    </ul>
                    <h2 className='text-sm sm:text-sm md:text-base lg:text-lg font-semibold'>b. Non-Personal Information</h2>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Device details</li>
                        <li>Cookies and usage data</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>2. How We Use Your Information</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>We use the information we collect for purposes including, but not limited to:</p>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Delivering and managing mentorship services.</li>
                        <li>Processing payments and session bookings.</li>
                        <li>Enhancing and personalizing your user experience.</li>
                        <li>Communicating with you, including responding to inquiries or feedback.</li>
                        <li>Fulfilling legal or regulatory requirements.</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>3. Sharing Your Information</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3' >We respect your privacy and do not sell your personal information. However, we may share your data under the following circumstances:</p>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li><span className='font-bold'>Service Providers:</span> Trusted third parties who support our platform operations, such as payment processors or hosting providers.</li>
                        <li><span className='font-bold'>Legal Compliance:</span> When required by law or to protect our rights, users, or platform integrity</li>
                    </ul>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>4. Cookies and Tracking Technologies</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>To improve your browsing experience, we use cookies and similar tracking technologies. These tools help us:</p>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li>Optimize platform functionality</li>
                        <li>Monitor and analyze site traffic.</li>
                        <li>Understand user preferences.</li>
                    </ul>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>You can control or disable cookies via your browser settings. However, some features of our platform may be limited if cookies are disabled.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>5. Your Data Protection Rights</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>Depending on your jurisdiction, you may have the right to:</p>
                    <ul className='text-sm sm:text-sm md:text-base lg:text-lg list-disc list-inside my-3'>
                        <li><span className='font-bold'>Access:</span> Request a copy of the personal data we hold about you.</li>
                        <li><span className='font-bold'>Correction:</span> Correct any inaccurate or incomplete information.</li>
                        <li><span className='font-bold'>Deletion:</span>  Request the deletion of your data.</li>
                        <li><span className='font-bold'>Restriction:</span> Limit how we process your information.</li>
                        <li><span className='font-bold'>Objection:</span>  Object to specific uses of your data</li>
                    </ul>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>To exercise any of these rights, please contact us at: <a href="mailto:" ><span className='text-blue-500 underline'>support@nexmentor.com</span></a> </p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>6. Data Security</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> We employ industry-standard technical and organizational measures to protect your data against unauthorized access, alteration, or loss. While no method of transmission or storage is completely secure, we continuously enhance our security protocols to ensure the security of your data.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>7. Third-Party Links</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> Our platform may contain links to external websites. Please note that we are not responsible for the privacy practices of third-party sites and encourage you to review their privacy policies.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>8. Updates to This Privacy Policy</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'> We may revise this Privacy Policy periodically to reflect changes in our practices or applicable laws. The updated policy will be posted on this page with the revised effective date. We encourage you to review it regularly.</p>
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-4'>9. Contact Us</h1>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'>For questions, concerns, or requests related to this Privacy Policy, please contact us via:</p>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3'><span className='font-bold'>Email:</span><a href="mailto:" ><span className='text-blue-500 underline ml-2'>support@nexmentor.com</span></a></p>
                    <p className='text-sm sm:text-sm md:text-base lg:text-lg my-3 font-bold'>NexMentor: Mentorship From Achievers</p>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy