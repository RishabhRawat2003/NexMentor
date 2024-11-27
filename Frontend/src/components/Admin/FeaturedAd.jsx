import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios';
import Loading from '../utils/Loading';

function FeaturedAd() {
    const [localSidebarState, setLocalSidebarState] = useState(false)
    const [loading, setLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [verificationAmount, setVerificationAmount] = useState('')
    const [settedVerificationAmount, setSettedVerificationAmount] = useState('')

    function handleStateChange() {
        setLocalSidebarState((prev) => !prev)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    async function getAdminDetails() {
        try {
            setLoading(true)
            const response = await axios.post('/api/v1/admin/admin-details')
            if (response.data.statusCode === 200) {
                setPreviewImage(response.data.data.featuredAd)
                setSettedVerificationAmount(response.data.data.verificationAmount)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error fetching admin details", error);
            setLoading(false)
        }
    }

    async function updateAdAndAmount() {
        try {
            setLoading(true)
            const formData = new FormData();
            if (verificationAmount !== settedVerificationAmount) formData.append("amount", verificationAmount);
            if (selectedImage) formData.append('image', selectedImage)
            const response = await axios.post("/api/v1/admin/add-feature-ad", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (response.data.statusCode === 200) {
                getAdminDetails()
                setLoading(false)
                setVerificationAmount('')
            }
        } catch (error) {
            console.log("Error updating ad and amount", error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getAdminDetails()
    }, [])


    return (
        <>
            {
                loading && <Loading />
            }
            <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
                <Header handleStateChange={handleStateChange} />
                <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-auto flex flex-col py-6 bg-white xl:px-5`}>
                    <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                        <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Featured Ad</span>
                    </div>
                    <div className='w-full h-auto mt-10'>
                        <img src={previewImage} alt="featured ad" className='w-[90%] h-[25vh] mx-auto bg-gray-400 rounded-xl sm:h-[40vh] lg:h-[55vh] object-cover shadow-custom' />
                        <div className="w-full h-auto flex justify-center items-center mt-5">
                            <input
                                type="file"
                                id="upload-image"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageChange(e)}
                            />
                            <label
                                htmlFor="upload-image"
                                className="px-6 py-2 bg-blue-500 md:hover:bg-blue-600 active:bg-blue-600 text-white font-cg-times rounded-md font-semibold cursor-pointer"
                            >
                                Upload Image
                            </label>
                        </div>
                    </div>
                    <div className='w-full h-auto flex flex-col gap-3 items-center sm:justify-between sm:flex-row mt-10'>
                        <div className='w-full h-auto flex flex-col gap-2 font-cg-times sm:w-auto'>
                            <label htmlFor="verificationAmount">Set Verification Amount</label>
                            <input type="text" id='verificationAmount' value={verificationAmount} onChange={(e) => setVerificationAmount(e.target.value)} placeholder='Enter verification amount' className='w-full h-auto outline-none border border-gray-400 p-2 rounded-md sm:w-[48%] md:w-[300px] xl:w-[400px]' />
                        </div>
                        <div className='w-full h-auto flex flex-col gap-2 font-cg-times sm:w-auto'>
                            <label htmlFor="verificationAmountSetted">Verification Amount</label>
                            <input type="text" id='verificationAmountSetted' value={settedVerificationAmount} disabled className='w-full h-auto outline-none border border-gray-400 p-2 rounded-md sm:w-[48%] md:w-[300px] xl:w-[400px] cursor-not-allowed' />
                        </div>
                    </div>
                    <div className='w-full h-auto flex flex-col justify-center items-center mt-10'>
                        <button onClick={updateAdAndAmount} className="px-6 py-2 bg-blue-500 md:hover:bg-blue-600 active:bg-blue-600 text-white font-cg-times rounded-md font-semibold cursor-pointer">Save Changes</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FeaturedAd