import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from "../Component/Common/Footer"
import CourseCard from "../Component/Core/Catelog/Course_Card"
import CourseSlider from "../Component/Core/Catelog/Course_Slider"
import {apiConnector} from "../Service/apiConnector"
import {categories} from "../Service/apis"
import {getCatalogPageData} from "../Service/Operation/pageAndComponentDatas"
import Error from "./Error"

function Catalog(){
    const {loading} = useSelector((state) => state.profile) // This hook extracts a specific part of the state from the Redux store.
    const {catalogName} = useParams() // This hook from React Router retrieves parameters from the URL
    const [active,setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [categoryId, setCategoryId] = useState("")

    useEffect(() =>{
        if(catalogName){
        ;(async () =>{      
            try{
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id
                setCategoryId(category_id)
            }
            catch(error){
                console.log("Could not fetch Categories.",error)
            }
        })()
    }
    },[catalogName])

    useEffect(() => {
    if (categoryId) {
      ; (async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [categoryId])


    if(loading || !catalogPageData){
        return(
            <div>
                <div className="spinner"></div>
            </div>
        )
    }
    if(!loading && !catalogPageData.success){
        return <Error/>
    }

    return(
        <>
         {/* Hero Section */}
         <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className="text-sm text-slate-300">
                {`Home / Catalog / `}
                  <span className="text-yellow-50">
                     {catalogPageData?.data?.selectedCategory?.name}
                  </span>
                </p>
                 <p className="text-3xl text-slate-50">
                   {catalogPageData?.data?.selectedCategory?.name}
                 </p>
                 <p className="max-w-[870px] text-slate-200">
                  {catalogPageData?.data?.selectedCategory?.description}
                 </p>
            </div>
         </div>

         {/* Section 1 */}
         <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div  className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-slate-600 text-sm">
                <p className={`px-4 py-2 ${active === 1 ?  "border-b border-b-yellow-50 text-yellow-50" : "text-slate-50"}  cursor-pointer`}
                   onClick={() => setActive(1)}>
                    Most Popular
                </p>
                <p className={`px-4 py-2 ${active === 2 ? "border-b border-b-yellow-50 text-yellow-50": "text-slate-50"} cursor-pointer`}
                   onClick={() => setActive(2)}>
                    New
                </p>
            </div>
            <div >
                  <CourseSlider
                  Courses={catalogPageData?.data?.selectedCategory?.courses}
                />
            </div>
         </div>

         {/* Section 2 */}
         <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
               Top courses in {catalogPageData?.data?.differentCategory?.name}
            </div>
            <div className="py-8">
                <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
            </div>
         </div>

         {/* Section 3 */}
         <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {catalogPageData?.data?.mostSellingCourses
                   ?.slice(0, 4)
                  .map((course, i) => (
                  <CourseCard course={course} key={i} Height={"h-[400px]"} />
              ))}
                </div>
            </div>
         </div>

         <Footer/>
        </>
    )
}

export default Catalog
