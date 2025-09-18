import React from "react";
import * as Icon1 from "react-icons/bi" // ??????
import * as Icon2 from "react-icons/hi2"
import * as Icon3 from "react-icons/io5"

const contactDetails = [
    {
        icon: "HiChatBubbleLeftRight",
        heading: "Chat on us",
        description: "Our friendly team is here to help",
        details: "himanshu.22430@knit.ac.in"
    },
    {
        icon: "BiWorld",
        heading: 'Visit us',
        description: "Come and say hello at our office HQ.",
        details:"Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
    },
    {
        icon:"IoCall",
        heading: "Call us",
        description: "Mopn-Fri from 8am to 5pm",
        details: "+123456789",
    }
]

const ContactDetails = () =>{
    return(
        <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
            {contactDetails.map((ele,i) => {
                let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]
                return(
                    <div key={i}
                    className="flex flex-col gap-[2px] p-3 text-sm text-slate-200">
                        <div className="flex flex-row items-center gap-3">
                            <Icon size={25}/>
                            <h1 className="text-lg font-semibold text-slate-100">{ele?.heading}</h1>
                        </div>
                        <p className="font-medium">{ele?.description}</p>
                        <p className="font-semibold">{ele.details}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ContactDetails