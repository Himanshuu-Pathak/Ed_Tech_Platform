import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {RxCross2} from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux";
import {createRating} from "../../../Service/Operation/courseDetailsAPI"
import IconBtn from "../../Common/IconBtn"

export default function CourseReviewModal({setReviewModal}){
    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const {courseEntireData} = useSelector((state) =>state.viewCourse)

    const {register, handleSubmit, setValue, formState:{errors},} = useForm();

    useEffect(() =>{
        setValue("courseExperience", "")
        setValue("courseRating",0)
    },[setValue])

    const ratingChanged = (newRating) =>{
        setValue("courseRating", newRating);
    }

     const onSubmit = async (data) =>{
        await createRating(
            {
                courseId: courseEntireData._id,
                rating: data.courseRating,
                review: data.courseExperiance,
            },
            token
        )
        setReviewModal(false);
     }
    return(
        <div>
            <div>
                {/* Modal header */}
                <div>
                    <p>Add review</p>
                    <button onClick={() => setReviewModal(false)}>
                        <RxCross2/>
                    </button>
                </div>
                {/* Modal Body */}
                <div>
                    <div>
                        <img src={user?.image} alt={user?.firstName + "profile"}/>
                        <div>
                            <p>
                                {user?.firstName}{user?.lastName}
                            </p>
                            <p></p>
                        </div>
                    </div>
                    <form  onSubmit={handleSubmit(onSubmit)}>
                        <ReactStars
                         count={5}
                         onChange={ratingChanged}
                         size={24}
                         activeColor="#ffd700"
                        />
                        <div>
                            <label>
                                Add your Experiance <sup>*</sup>
                            </label>
                            <textarea
                             id="courseExperience"
                            placeholder="Add Your Experience"
                            {...register("courseExperience", { required: true })}
                            />
                            {errors.courseExperiance && (
                                <span>
                                    Please add your Experiance
                                </span>
                            )}
                        </div>
                        <div>
                            <button onClick={() => setReviewModal(false)}>
                                Cancel
                            </button>

                            <button>
                                <IconBtn text="save"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}