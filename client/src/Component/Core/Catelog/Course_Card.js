
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom"

import GetAvgRating from "../../../Util/avgRating"
import RatingStars from "../../Common/RatingStars"

function Course_Card({course, Height}){


    const [avgReviewCount, setAvgReviewCount] = useState(0)
    useEffect(() =>{
        const count = GetAvgRating(course.ratingAndReviews)
        setAvgReviewCount(count)

    }, [course])

    return(
        <>
           <Link to={`/courses/${course._id}`}>
           <div >
            <div className="rounded-lg">
                <img
                    src={course?.thumbnail}
                    alt="course thumnail"
                    className={`${Height} w-full rounded-xl object-cover `}
                />
            </div>
            <div>
                <p className="text-xl text-slate-100">{course?.courseName}</p>
                <p className="text-sm text-slate-200">
                {course?.instructor?.firstName} {course?.instructor?.lastName}
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-yellow-50">
                        {avgReviewCount || 0}
                    </span>
                    <RatingStars  Review_Count={avgReviewCount}/>
                    <span className="text-slate-100">{course?.ratingAndReviews?.length} Ratings</span>
                </div>
                <p className="text-xl text-slate-100">Rs. {course?.price}</p>
            </div>
           </div>
           </Link>
        </>
    )
}

export default Course_Card