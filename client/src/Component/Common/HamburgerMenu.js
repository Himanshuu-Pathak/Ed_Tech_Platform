import React, {useEffect, useRef, useState} from "react";
import {RxCross2} from "react-icons/rx"
import useOnClickOutside from "../../Hook/useOnClickOutside"; //  custom hook

const HamburgerMenu = ({children, isMenuModalOpen, setIsMenuModalOpen}) =>{
    const modalDiv = useRef(null);
    useOnClickOutside(modalDiv, () => setIsMenuModalOpen(false));

    return(
        <div className={` md:hidden fixed inset-0 overflow-auto z-[100] transition-all duration-700
            ${isMenuModalOpen ? "translate-x-0" : "translate-x-full"} 
          `}>
            <div className='flex min-h-full'>
                <div className=' bg-slate-200 bg-opacity-20 w-1/4 '>
                    <div
                        className='mt-5 ml-auto mr-5 h-14 aspect-square rounded-full bg-slate-950 text-white grid place-items-center text-lg cursor-pointer removeBlueBoxColor'
                        onClick={() => setIsMenuModalOpen(false)}
                    >
                       <RxCross2 fontSize={32} className={'fill-slate-100 '}/>
                    </div>
                </div>

                <div ref={modalDiv} className='w-3/4 bg-slate-950 text-white'>
                    {
                        children
                    }
                </div>
            </div>
        </div>
    )
}

export default HamburgerMenu