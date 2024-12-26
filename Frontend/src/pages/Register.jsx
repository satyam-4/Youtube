import { useState } from "react"
import youtubeLogo from "../icons/youtube.svg"
import axios from "axios"

const Register = () => {
    const [avatar, setAvatar] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(URL.createObjectURL(file))
            setAvatarFile(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userData = {
            fullName: e.target.fullName.value,
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            avatar: avatarFile
        }

        try {
            const response = await axios.post("http://localhost:8000/api/v1/users/register", userData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log(response)
            alert("User registered successfully")
        } catch (error) {
            console.log("Registration failed: ", error)
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
                        
                        <div className="bg-red-200 rounded-full mb-10 relative">
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute rounded-full inset-0 opacity-0 cursor-pointer" 
                                name="avatar"
                                onChange={handleAvatarChange} 
                            />
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <img 
                                    src="https://www.svgrepo.com/show/507875/user.svg" 
                                    alt="Default Avatar" 
                                    className="w-full h-full object-cover" 
                                    />
                                )}
                            </div>
                        </div>
                        
                        <form 
                        onSubmit={handleSubmit}
                        className="w-[80%] flex flex-col gap-5"
                        action="">
                            <input 
                            className="p-2 rounded-md text-xl border-2 border-[#00000049] focus:outline-blue-500 focus:outline focus:outline-4 focus:border-transparent"
                            type="text" 
                            placeholder="Full Name"
                            name="fullName"/>

                            <input 
                            className="p-2 rounded-md text-xl border-2 border-[#00000049] focus:outline-blue-500 focus:outline focus:outline-4 focus:border-transparent"
                            type="text" 
                            placeholder="Username"
                            name="username"/>

                            <input 
                            className="p-2 rounded-md text-xl border-2 border-[#00000049] focus:outline-blue-500 focus:outline focus:outline-4 focus:border-transparent"
                            type="email" 
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
                                Create Account
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register