import React, { useEffect } from "react"
import { Bell, Menu, Search } from "lucide-react"
import YoutubeLogo from "../../assets/YoutubeLogo.svg"
import { useSelector, useDispatch } from "react-redux"
import { toggleSidebarState } from "../../features/sidebar/sidebarSlice.js"

const Navbar = () => {
    const sidebarState = useSelector((state) => state.sidebar.isExpanded)
    const dispatch = useDispatch()

    const handleMenuClick = () => {
        dispatch(toggleSidebarState())
    }
    
    useEffect(() => {
        localStorage.setItem("isExpanded", sidebarState)
    }, [sidebarState])

    return (
        <>
            <div className="pr-5 w-full h-[8%] bg-black flex items-center justify-between">
                <div className="h-full w-[6%] flex justify-center items-center">
                    <button onClick={handleMenuClick}>
                        <Menu color="white"/>
                    </button>
                </div>
                <img 
                style={{width: "6rem"}}
                src={YoutubeLogo} 
                alt="Youtube" />
                
                <div className="mx-auto w-[40rem] h-[3rem] flex items-center rounded-3xl overflow-hidden">
                    <input 
                    className="w-[90%] h-full rounded-l-3xl text-white bg-gray-800  px-5 outline-blue-500 "
                    type="text" 
                    placeholder="Search" />
                    
                    <button className="bg-gray-700 w-[10%] h-full flex justify-center items-center">
                        <Search color="white" />
                    </button>
                </div>

                <div className="flex items-center gap-5">
                    <button>
                        <Bell color="white"/>
                    </button>

                    <div className="bg-slate-400 w-8 h-8 rounded-full items-center justify-center overflow-hidden">
                        <img 
                        className="w-full h-full object-cover"
                        src="https://imgs.search.brave.com/mYuKqM8YeN3Xo0rk0ioz3wRsMz8tw2c9O8pUk5uohlI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dzNzY2hvb2xzLmNv/bS9ob3d0by9pbWdf/YXZhdGFyLnBuZw" 
                        alt="avatar" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar