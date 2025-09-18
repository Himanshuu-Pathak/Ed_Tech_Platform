import toast from "react-hot-toast";
import rzpLogo from "../../Asset/Logo/rzp_logo.png"
import {resetCart} from "../../Slice/cartSlice"
import {setPaymentLoading} from "../../Slice/courseSlice"
import {apiConnector} from "../apiConnector"
import {studentEndpoints} from "../apis"

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API,} = studentEndpoints

//Load the razorpay SDK from the SDN

function loadScript(src){
    return new Promise((resolve) =>{
        const script = document.createElement("script")
        script.src = src;
        script.onload = () =>{ resolve(true)}
        script.onerror = () => { resolve(false) }
        document.body.appendChild(script)
    })
}


// buy the course
export async function BuyCourse(token, courses, user_details, navigate, dispatch){
    const toastId = toast.loading("Loading...")
    try{
        // loading the script of Razorpay SDK
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toast.error("Razorpay SDK failed to load. Check your Internet Connection.");
            return;
        }
       


         // Initialising the order in backend

         //Making a POST request to initiate the payment
         const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses}, {Authorization: `Bearer ${token}`})

         // Checking if the API call was successful
         if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
         }
         console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

         // opening the Razorpay Bakend

         // Preparing the Razorpay payment options
         const options = {
            key: "rzp_test_t4LUM04KXw6wHc",
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "StudyNotion",
            description: "Thank you for Purchasing the Course.",
            image: rzpLogo,
            prefill: {
            name: `${user_details.firstName} ${user_details.lastName}`,
            email: user_details.email,
        },

           
             handler: function (response) {
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
                verifyPayment({ ...response, courses }, token, navigate, dispatch)
              },
            }

            //Opening the Razorpay payment modal

             const paymentObject = new window.Razorpay(options)
             paymentObject.open()

             //Handling payment failure
             paymentObject.on("payment.failed", function (response) {
             toast.error("Oops! Payment Failed.")
             console.log(response.error)
         })
    }
    catch(error){
        console.log("PAYMENT API ERROR............", error)
        toast.error("Could Not make Payment.")
    }
    toast.dismiss(toastId)
}

// vrify the payment
async function verifyPayment(bodyData, token, navigate, dispatch){
    const toastId = toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true))
    try{

        //Making the POST request to verify the payment
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {Authorization: `Bearer ${token}`,})

        console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

        // Checking if the verification was successful

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        // Payment Success Handling
        toast.success("Payment Successful . You are added to the course")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart())
    }catch(error){
        console.log("PAYMENT VERIFY ERROR............", error)
        toast.error("Could not verify payment")
    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}


// send the payment success email
async function sendPaymentSuccessEmail(response, amount, token){
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, { ORDER_ID: Response.razorpay_order_id, paymentId: response.razorpay_payment_id, amount,}, {Authorization: `Bearer ${token}`,})
    }catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
    }
}


//loadScript that dynamically loads an external JavaScript file into a webpage
// Promise is an object that represents the eventual completion or failure of an asynchronous operation. 
// onload event is triggered when the script has successfully loaded.
// onerror event is triggered if there is an error loading the script 
