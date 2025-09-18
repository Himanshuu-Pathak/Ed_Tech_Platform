import React from "react";

const Stats = [
    {count: "5k", label:" Active Student"},
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
];

const StatsComponents = () =>{
    return(
        <div className="bg-slate-700">
            {/* STATS */}
            <div className="flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto ">
                <div className="grid grid-cols-2 md:grid-cols-4 text-center">
                    {Stats.map((data,index) => {
                        return(
                            <div className="flex flex-col py-10" key={index}>
                                <h1 className="text-[30px] font-bold text-slate-50">
                                    {data.count}
                                </h1>
                                <h2 className="font-semibold text-[16px] text-slate-500">
                                    {data.label}
                                </h2>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default StatsComponents