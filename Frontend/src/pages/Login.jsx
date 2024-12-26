import React from "react"
import youtubeLogo from "../icons/youtube.svg"
import axios from "axios"

const Login = () => {

    const handleSubmit = async (e) => {
    e.preventDefault()
    const userData = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    
    try {
        const response = await axios.post("http://localhost:8000/api/v1/users/login", userData, { withCredentials: true })
        console.log(response)
        alert("User logged in successfully")
    } catch (error) {
        console.log("Login failed: ", error)
    }
}

    return (
        <>
            <div className="h-screen w-screen bg-slate-200">
                <div className="pl-2 w-full h-[10%]">
                    <img 
                    style={{width: "4rem"}}
                    src={youtubeLogo} 
                    alt="Youtube" 
                    />
                </div>
                <div className="w-full h-[90%] flex justify-center items-center">
                    <div className="w-[35%] p-5 bg-white rounded-lg flex flex-col justify-center shadow-md shadow-[#36363631] items-center">
                        <div className="mb-10 w-[80%] text-3xl font-bold">
                            Welcome Back,
                        </div>
                        <form 
                        onSubmit={handleSubmit}
                        className="w-[80%] flex flex-col gap-5"
                        action="">
                            <input 
                            className="p-2 rounded-md text-xl border-2 border-[#00000049] focus:outline-blue-500 focus:outline focus:outline-4 focus:border-transparent"
                            type="text" 
                            placeholder="Email"
                            name="email"/>

                            <input 
                            className="p-2 rounded-md text-xl border-2 border-[#00000049] focus:outline-blue-500 focus:outline focus:outline-4 focus:border-transparent"
                            type="password" 
                            placeholder="Password"
                            name="password"/>

                            <button
                            className="bg-red-500 font-bold text-xl p-3 rounded-2xl text-white hover:bg-red-600"
                            type="submit">
                                Login
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login