import React from 'react';
import Image from '../images/becamementor/image2.webp';

function ScrollView() {
    return (
        <div className="w-full h-auto flex flex-col md:flex-row my-5 lg:px-10 xl:px-20 lg:gap-4">
            {/* Sticky Image Section */}
            <div className="hidden md:block md:w-[50%] sticky top-10 h-[calc(100vh-2.5rem)]">
                <img src={Image} alt="Mentor" className="w-full h-full object-cover" />
            </div>
            
            {/* Content Section */}
            <div className="w-full h-auto flex flex-col px-5 sm:w-[50%] sm:mx-auto">
                <p className="py-1.5 border-l-2 px-3 md:text-lg font-semibold md:py-2 border-l-black text-[#000B26]">
                    Why Become NexMentor?
                </p>
                <div className="w-full h-auto flex flex-col text-4xl font-bold mt-5 gap-2 md:text-5xl xl:text-6xl md:gap-4">
                    <h2>Why Become a</h2>
                    <h2>NexMentor?</h2>
                </div>
                <div className="w-full h-auto flex flex-col mt-5 gap-4 md:gap-6 xl:gap-10 md:mt-10">
                    {[
                        {
                            title: '1. Transform Lives, One Session at a Time',
                            description:
                                'Your insights can make the difference between doubt and confidence, hesitation and determination. You’ll provide aspirants with the courage and tools they need to pursue their dreams.',
                        },
                        {
                            title: '2. Earn While You Inspire',
                            description:
                                'We value your time and commitment, allowing you to earn while you share your wisdom. The more sessions you conduct, the more you earn, empowering you to achieve financial independence as you help others.',
                        },
                        {
                            title: '3. Mentor on Your Terms',
                            description:
                                'We understand the demands of medical school. With NexMentor, you control your schedule, mentoring when it suits you, ensuring you can give back without compromising on your own goals.',
                        },
                        {
                            title: '4. Be Their Friend, Not Just Their Mentor',
                            description:
                                'Our one-on-one sessions provide a safe, private environment where aspirants can comfortably share, ask, and learn. You won’t just be a mentor but also a friend who understands their journey.',
                        },
                        {
                            title: '5. Build Lifelong Skills',
                            description:
                                'Mentorship hones your communication, empathy, and problem-solving skills while adding meaningful experience to your resume. It’s an invaluable way to grow professionally and personally.',
                        },
                        {
                            title: '6. Leave a Legacy',
                            description:
                                'Imagine looking back, knowing you helped shape the lives of future doctors. Through NexMentor, you’re creating a ripple effect—a legacy that lives on in those you guide.',
                        },
                    ].map((item, index) => (
                        <div key={index} className="w-full h-auto flex flex-col gap-2">
                            <h2 className="font-semibold md:text-lg xl:text-2xl">{item.title}</h2>
                            <p className="text-[#2C2C2C] text-sm md:text-base xl:text-lg">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ScrollView;
