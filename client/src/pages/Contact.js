import React from "react";
import Footer from "../Component/Common/Footer"
import ReviewSlider from "../Component/Common/ReviewSlider"
import ContactDetails from "../Component/Core/ContactUsPage/ContactDetails"
import ContactForm from "../Component/Core/ContactUsPage/ContactForm"

const Contact = () =>{
    return(
        <div>
            <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row" >
                {/* ContactDetails */}
                <div className="lg:w-[40%]">
                    <ContactDetails/>
                </div>

                {/* contact Form */}
                <div className="lg:w-[60%]">
                    <ContactForm/>
                </div>
            </div>

                <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-slate-900 text-white">
                    {/* Reviews from other learner */}
                    <h1 className="text-center text-4xl font-semibold mt-8">
                        Reviews from other learner
                    </h1>
                    <ReviewSlider/>
                </div>
               <Footer/>
        </div>
    )
}

export default Contact