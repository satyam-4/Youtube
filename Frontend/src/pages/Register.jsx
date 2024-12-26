import React from "react"
import youtubeLogo from "../icons/youtube.svg"

const Register = () => {
    return (
        <>
            <div className="h-screen w-screen bg-slate-200">
                <div className="pl-2 w-full h-[10%]">
                    <img 
                    style={{width: "4rem"}}
                    src={youtubeLogo} 
                    alt="Youtube" />
                </div>
                <div className="w-full h-[90%] flex justify-center items-center">
                    <div className="p-5 bg-white rounded-md flex flex-col justify-center items-center">
                        <form 
                        className="flex flex-col"
                        action="">
                            <input type="text" placeholder="Full Name"/>
                            <input type="text" placeholder="Username"/>
                            <input type="email" placeholder="Email"/>
                            <input type="password" placeholder="Password"/>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register