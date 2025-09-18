import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form"
import CountryCode from "../../../data/countrycode.json"
import {apiConnector}from "../../../Service/apiConnector"
import {contactusEndpoint} from "../../../Service/apis"


const ContactUsForm = () =>{
    const [loading, setLoading] = useState(false)
      
    const  submitContactForm = async (data) =>{
        try{
            setLoading(true)
            const res = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data)
            setLoading(false)
        }
        catch(error){
            console.log("ERROR MESSAGE - ", error.message)
            setLoading(false)
        }
    }
    const { register, handleSubmit,reset,formState:{errors, isSubmitSuccessful},} = useForm();

    useEffect(() => { 
        if (isSubmitSuccessful) { reset({ email: "", firstname: "", lastname: "", message: "", phoneNo: "" }); } }, [isSubmitSuccessful, reset]);

            return(
                <form className="flex flex-col gap-7"
                  onSubmit={handleSubmit(submitContactForm)}
                >
                    <div className="flex flex-col gap-5 lg:flex-row">

                        {/* first name */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor className="lable-style">
                                firstName
                            </label>
                            <input
                               type="text" name="firstname" id="firstname" placeholder="Enter first name" 
                               {...register("firstname", { required: true })}
                                 className="form-style"
                            />
                            {errors.firstname && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your name.
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="lastname" className="lable-style">Last Name</label>
                            <input text="text" name="lastname" id="lastname" placeholder="Enter Last Name.."
                            className="form-style"
                             {...register("lastname")}
                            />
                        </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="lable-style" >Email Address</label>
                            <input type="email" name="email" id="email" placeholder="Enter email address..." className="form-style"
                            {...register("email",{required:true})}
                            />
                            {errors.email && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter email address..
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="lable-style">
                                Phone Number
                            </label>

                            <div className="flex gap-5"> 
                                <div className="flex w-[81px] flex-col gap-2">
                                    <select
                                         type="text"
                                         name="firstname"
                                         id="firstname"
                                         placeholder="Enter first name"
                                         className="form-style"
                                         {...register("countrycode", { required: true })}
                                    >
                                        {CountryCode.map((ele,i) =>{
                                            return(
                                                <option key={i} value={ele.code}>
                                                    {ele.code}-{ele.country}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>

                                <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                                    <input type="number" name="phonenumber" id="phonenumber" placeholder="12345 67890 " className="form-style"
                                      {...register("phoneNo", {
                                        required: {
                                            value: true,
                                            message: "Please enter your Phone Number.",
                                        },
                                        maxLength: {value:12, message: "Invalid Phone Number"},
                                        minLength: {value: 10, message:"Invalid PhonE Number"},
                                      })}
                                    />
                                </div>

                            </div>
                            {errors.phoneNo && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.phoneNo.message}
                            </span>
                        )}
                        </div>


                        <div className="flex flex-col gap-2">
                            <label className="lable-style">Message</label>
                            <textarea name="message" id="message" cols="30" rows="7" className="form-style"
                              {...register("message", {required:true})}
                            />
                            {errors.message && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your message..
                                </span>
                            )}
                        </div>

                        <button disabled={loading} type="submit"
                        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
                            ${
                                !loading &&
                                "transition-all duration-200 hover:scale-95 hover:shadow-none"
                            }  disabled:bg-slate-500 sm:text-[16px] `}
                        >
                            Send Message
                        </button>

                </form>
            );
        };
    

export default ContactUsForm