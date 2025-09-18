import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import {RxCountdownTimer} from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux";
import {  sendOtp, signUp } from "../Service/Operation/authAPI"; // sendOtp defined but never used
import { useNavigate } from "react-router-dom";

function VerifyEmail(){
    const [otp, setOtp] = useState(""); // create and manage local state within the component const[local state variable, function]
    const {signupData, loading} = useSelector((state) => state.auth); // access specific part of redux state
    const dispatch = useDispatch(); // dispatch redux action
    const navigate = useNavigate();// used for navigation

    useEffect(() =>{ // handle side effect such as api call or navigation
        if(!signupData){
            navigate("/signup");
        }
    }, [signupData, navigate]); // [] Empty dependency array ensures this effect runs only once after the initial render.

    //In React, side effects are actions performed outside the rendering process, such as interacting with a server or managing browser APIs.

    const handleVerifyAndSignup = (e) =>{
        e.preventDefault();
        const {accountType, firstName, lastName, email, password, confirmPassword,} = signupData;
        dispatch(
            signUp(accountType, firstName , lastName, email, password, confirmPassword, otp, navigate)
        );
    }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
            {loading ? (
                <div >
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-slate-50 font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
                
                <p className="text-[1.125rem] leading-[1.625rem] my-4 text-slate-100">   A verification code has been sent to you. Enter the code below</p>

                <form onSubmit={handleVerifyAndSignup}>
                    <OTPInput value={otp} onChange={setOtp} numInputs={6} renderInput={(props) =>(
                        <input {...props} placeholder="-" style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",}}
                          className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-slate-50 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                        />
                       )}
                       containerStyle={{
                        justifyContent:"space-between", gap: "0 6px",
                       }}
                    />
                    <button type="submit"
                     className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-slate-900"
                    > Verify Email</button>
                </form>
                <div className="mt-6 flex items-center justify-between">
                    <Link to="/signup">
                       <p className="text-slate-50 flex items-center gap-x-2">
                         <BiArrowBack /> Back To Signup
                       </p>
                    </Link>

                    <button className="flex items-center text-blue-100 gap-x-2"
                            onClick={() => dispatch(sendOtp(signupData.email))} >
                        <RxCountdownTimer/> Resend it
                    </button>
                </div>
                </div>
            )}
        </div>
    );
}

export default VerifyEmail;