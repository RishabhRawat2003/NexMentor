import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios';
import Loading from '../utils/Loading';
import { IoClose } from "react-icons/io5";
import TextField from '@mui/material/TextField';
import { MdDelete } from "react-icons/md";


function BlogPost() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [totalBlogs, setTotalBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [container, setContainer] = useState('blogs')
  const [singleBlog, setSingleBlog] = useState({})
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [addBlog, setAddBlog] = useState({
    title: '',
    content: ''
  })
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = totalBlogs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalBlogs.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

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

  async function AddSingleBlog() {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', addBlog.title)
      formData.append('content', addBlog.content)
      if (selectedImage) formData.append('image', selectedImage)
      const response = await axios.post('/api/v1/admin/add-blog', formData)

      if (response.data.statusCode === 200) {
        setLoading(false)
        getBlogs()
        setSelectedImage(null)
        setPreviewImage(null)
        setAddBlog({
          title: '',
          content: ''
        })
      }

    } catch (error) {
      console.log("Error while adding blog", error);
      setLoading(false)
    }
  }

  async function getSingleBlog(id) {
    try {
      setLoading(true)
      const response = await axios.post(`/api/v1/admin/get-single-blog/${id}`)
      if (response.data.statusCode === 200) {
        setLoading(false)
        setSingleBlog(response.data.data)
        setContainer("singleBlog")
      }

    } catch (error) {
      console.log("Error while getting a blog", error);
      setLoading(false)
    }
  }

  async function deleteBlog(id) {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/admin/remove-blog', { id })
      if (response.data.statusCode === 200) {
        setLoading(false)
        getBlogs()
      }
    } catch (error) {
      console.log("Error while getting a blog", error);
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    getBlogs()
  }, [])

  return (
    <>
      {
        loading && <Loading />
      }
      <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
        <Header handleStateChange={handleStateChange} />
        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-auto flex flex-col py-6 bg-white xl:px-5`}>
          {/* Total Blogs Container */}
          {
            container === 'blogs' && <div className='w-full h-auto flex flex-col'>
              <div className='w-full h-auto flex justify-between gap-4 items-center'>
                <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Total Blogs</span>
                <span onClick={() => setContainer('addBlogs')} className='text-blue-500 md:hover:text-blue-700 tracking-wider active:text-blue-700 text-lg cursor-pointer underline font-semibold font-cg-times'>Add Blogs</span>
              </div>
              <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
                {currentItems?.map((blog, index) => (
                  <div
                    key={index}
                    className="w-full h-auto p-4 border justify-between rounded-lg shadow-md bg-white flex flex-col"
                  >
                    <div className='w-full h-auto flex flex-col'>
                      <img src={blog.image} alt="testimonial image" className='w-full h-40 object-cover mx-auto border border-gray-400' />
                      <span className='mx-auto lg:text-lg font-semibold mt-3'>{blog.title.length > 30 ? blog.title.slice(0, 30) + '...' : blog.title}</span>
                      <p className='w-full h-auto text-center text-sm mt-2 text-gray-400'>
                        {blog.content.length > 30 ? blog.content.slice(0, 150) + '...' : blog.content}
                      </p>
                    </div>
                    <p className='flex justify-between items-center mt-3'>
                      <span onClick={() => getSingleBlog(blog._id)} className='text-blue-500 font-cg-times md:hover:text-blue-600 active:text-blue-600 cursor-pointer hover:underline active:underline underline-offset-2'>View</span>
                      <MdDelete onClick={()=> deleteBlog(blog._id)} size={25} className='text-red-500 cursor-pointer md:hover:text-red-600 active:text-red-600' />
                    </p>
                  </div>
                ))}
              </div>
              {
                totalBlogs.length > 8 && (
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 border rounded-md text-sm font-medium 
            ${currentPage === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 border rounded-md text-sm font-medium 
            ${currentPage === totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                      Next
                    </button>
                  </div>
                )
              }
            </div>
          }
          {/* Add Blogs Container*/}
          {
            container === 'addBlogs' && <div className='w-full h-auto flex flex-col'>
              <div className='w-full h-auto flex justify-between gap-4 items-center'>
                <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Add Blogs</span>
                <IoClose onClick={() => setContainer('blogs')} size={20} className='cursor-pointer lg:size-7' />
              </div>
              <div className='w-full h-auto flex flex-col-reverse md:flex-row gap-4 mt-5 lg:mt-10'>
                <div className='w-full h-auto flex flex-col gap-3 lg:w-[60%] xl:w-[70%]'>
                  <TextField
                    label="Title"
                    variant="outlined"
                    margin="normal"
                    className='w-full'
                    value={addBlog.title}
                    onChange={(e) => setAddBlog({ ...addBlog, title: e.target.value })}
                  />
                  <textarea placeholder='Write content here' value={addBlog.content} onChange={(e) => setAddBlog({ ...addBlog, content: e.target.value })} className='min-h-80 p-2 bg-transparent rounded-md border outline-none border-gray-400 resize-none'></textarea>
                </div>
                <div className='w-full h-auto flex justify-center items-center lg:w-[40%] lg:items-start xl:w-[30%]'>
                  <div className='w-[90%] h-auto flex flex-col gap-3 lg:border-[1px] rounded-lg lg:border-gray-300 lg:py-10 lg:shadow-custom lg:gap-6'>
                    <img src={previewImage} alt="picture" className='w-full h-64 md:w-60 bg-gray-400 md:h-48 mx-auto rounded-md object-cover' />
                    <div className="w-full h-auto flex justify-center items-center">
                      <input
                        type="file"
                        id="upload-image"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e)}
                      />
                      <label
                        htmlFor="upload-image"
                        className="px-5 py-1.5 bg-blue-500 text-white font-cg-times rounded-md text-sm cursor-pointer"
                      >
                        Upload Image
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full h-auto flex justify-center items-center md:justify-start mt-5 xl:mt-10'>
                <span onClick={AddSingleBlog} className='px-6 py-2 bg-blue-500 md:hover:bg-blue-600 active:bg-blue-600 font-semibold font-cg-times text-white cursor-pointer rounded-md'>
                  Add Blog
                </span>
              </div>
            </div>
          }
          {/* Single Blogs Container*/}
          {
            container === 'singleBlog' && <div className='w-full h-auto flex flex-col'>
              <div className='w-full h-auto flex justify-end gap-4 items-center'>
                <IoClose onClick={() => setContainer('blogs')} size={20} className='cursor-pointer lg:size-7' />
              </div>
              <div className='w-full h-auto flex flex-col mt-5 font-cg-times'>
                <h2 className='text-xl lg:text-2xl 2xl:text-5xl font-semibold'>{singleBlog.title}</h2>
                <img src={singleBlog.image} alt="blog image" className='w-full my-3 lg:w-[60%] lg:mx-auto' />
                <p className='text-base md:text-lg text-gray-700 mt-5 lg:mt-10' style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: singleBlog.content }}></p>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default BlogPost