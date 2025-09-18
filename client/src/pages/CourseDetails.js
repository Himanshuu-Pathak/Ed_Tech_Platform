import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import ConfirmationModal from "../Component/Common/ConfirmationModal"
import Footer from "../Component/Common/Footer"
import RatingStars from "../Component/Common/RatingStars"
import CourseAccordionBar from "../Component/Core/Course/CourseAccordionBar"
import CourseDetailsCard from "../Component/Core/Course/CourseDetailsCard"
import { formatDate } from "../Service/formatDate"
import { fetchCourseDetails } from "../Service/Operation/courseDetailsAPI"
//import { BuyCourse } from "../Service/Operation/studentFeaturesAPI"
import GetAvgRating from "../Util/avgRating"
import Error from "./Error"

function CourseDetails() {    
    const {user} = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const {loading} = useSelector((state) => state.profile)
    const {paymentLoading} = useSelector((state) => state.course)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {courseId} = useParams();

    const [response, setResponse] = useState(null)
    const [confirmationModal, setConfirmationModal] = useState(null)
    useEffect(() =>{
        ;(async() =>{
            try{
                const res = await fetchCourseDetails(courseId)
                setResponse(res)
            }
            catch(error){
                console.log("Could not fetch Course Details")
            }
        })()
    }, [courseId])


    const [avgReviewCount, setAvgReviewCount] = useState(0)
    useEffect(() =>{
        const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
        setAvgReviewCount(count)
    },[response])

    const [isActive, setIsActive] = useState(Array(0))
    const handleActive = (id) =>{
        setIsActive(!isActive.includes(id) ? isActive.concat([id]) : isActive.filter((e) => e !== id))
    }

    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
        let lectures = 0;
        response?.data?.courseDetails?.courseContent?.forEach((sec) =>{
            lectures += sec.subSection.length || 0 // length property gives the number of elements in array
        })
        setTotalNoOfLectures(lectures)
    },[response])

    if(loading || !response){
        return(
            <div>
                <div className="spinner"></div>
            </div>
        )
    }
    if(!response.success){
        return <Error/>
    }

    const { _id:course_id, courseName, courseDescription , thumbnail, price, whatYouWillLearn, courseContent, ratingAndReviews, instructor, studentsEnroled, createdAt,} = response.data?.courseDetails

    const handleBuyCourse = () =>{
        if(token){
            handleBuyCourse(token, [course_id], user, navigate, dispatch)
            return
        }

        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
          })
    }

    if (paymentLoading) {

        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

      return(
        <>
        <div className={`relative w-full bg-richblack-800`}>
            {/* Hero section */}
            <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
                <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                    <div className="relative block max-h-[30rem] lg:hidden">
                        <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                        <img src={thumbnail} alt=""  className="aspect-auto w-full"/>
                    </div>

                    <div className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-slate-50`}>
                        <div>
                            <p className="text-4xl font-bold text-slate-50 sm:text-[42px] tracking-wider lg:text-left text-center">
                                {courseName}
                            </p>
                        </div>

                        <p className={`text-slate-200`}>
                        <ul style={{ listStyle: 'none', padding: 0 }} >
                           {courseDescription.split('\n').map((line, index) => (
                           <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                           <span style={{ marginRight: '0.5em' }}>{index + 1}.</span>
                           <span>{line.trim().substring(line.indexOf('.') + 1).trim()}</span>
                           </li>
                            ))}
                        </ul>
                        </p>

                        <div className="text-md flex flex-wrap items-center gap-2 lg:justify-start justify-center">
                            <span>{avgReviewCount}</span>
                            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
                            <span>{`(${ratingAndReviews.length} reviews)`}</span>
                            <span>{`${studentsEnroled.length} students enrolled`}</span>
                        </div>

                        <div>
                            <p>
                                Created By {`${instructor.firstName} ${instructor.lastName}`}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5 text-lg">
                            <p className="flex items-center gap-2">
                                {" "}
                                <BiInfoCircle /> Created at {formatDate(createdAt)}
                            </p>

                            <p className="flex items-center gap-2">
                                {" "}
                                <HiOutlineGlobeAlt /> English
                            </p>
                        </div>

                    </div>

                    <div className="flex w-full flex-col gap-4 border-y border-y-slate-500 py-4 lg:hidden">
                        <p className="space-x-3 pb-4 text-3xl font-semibold text-slate-50">
                            Rs. {price}
                        </p>
                        <button className="yellowButton uppercase tracking-wider" onClick={handleBuyCourse}>
                            Buy Now
                        </button>
                        <button className="blackButton uppercase tracking-wider">Add to Cart</button>
                    </div>

                </div>

                {/* course card */}

                <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                    <CourseDetailsCard
                      course={response?.data?.courseDetails}
                      setConfirmationModal={setConfirmationModal}
                      handleBuyCourse={handleBuyCourse}
                    />
                </div>
            </div>
        </div>

        <div className="mx-auto box-content px-4 text-start text-slate-50 lg:w-[1260px]">
            <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                {/* What will you learn section */}
                <div className="my-8 border border-slate-600 p-8">
                    <p className="text-3xl font-semibold uppercase tracking-wider">What you'll Learn?</p>
                    <div className="mt-5">
                       <ul style={{ listStyle: 'none', padding: 0 }} className="leading-relaxed">
                       {whatYouWillLearn.split('\n').map((line, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                       <span style={{ marginRight: '0.5em' }}>{index + 1}.</span>
                      <span>{line.trim().substring(line.indexOf('.') + 1).trim()}</span>
                      </li>
                         ))}
                    </ul>
                    </div>
                </div>

                {/* course content section */}

                <div className="max-w-[830px] ">
                    <div className="flex flex-col gap-3">
                        <p className="text-[28px] font-semibold uppercase tracking-wider">Course Content</p>
                        <div className="flex flex-wrap justify-between gap-2">
                            <div className="flex gap-2 tracking-wide">
                                <span>
                                    {courseContent.length} {`section(s)`}
                                </span>
                                <span>
                                    {totalNoOfLectures} {`lecture(s)`}
                                </span>
                                <span>{response.data?.totalDuration}</span>
                            </div>

                            <div>
                                <button   className="text-yellow-50"
                                 onClick={() => setIsActive([])}>
                                    Collasp all section
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* course detail accordian */}
                    <div className="py-4">
                       {courseContent?.map((course, index) => (
                      <CourseAccordionBar
                       course={course}
                       key={index}
                       isActive={isActive}
                       handleActive={handleActive}
                      />
                      ))}
                    </div>

                    {/* author details */}

                    <div className="mb-12 py-4">
                        <p className="text-[28px] font-semibold">Author</p>
                        <div className="flex items-center gap-4 py-4">
                            <img 
                            src={
                                instructor.image
                                  ? instructor.image
                                  : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                              }
                              alt="Author"
                              className="h-14 w-14 rounded-full object-cover"/>
                            <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                        </div>
                        <p className="text-slate-50">
                            {instructor?.additionalDetails?.about}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
           {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
      )
}

export default CourseDetails