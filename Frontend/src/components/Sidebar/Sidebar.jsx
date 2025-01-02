import React from "react"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { 
    House as Home, 
    Rss, CircleUserRound, 
    ArrowRight, History,
    ListVideo, Clock,
    ThumbsUp, Settings     
} from 'lucide-react';

const Sidebar = () => {
    const sidebarState = useSelector((state) => state.sidebar.isExpanded)

    return (
        <>
            {
                sidebarState ?
                <div className="w-[16%] h-[92%] bg-black text-white font-semibold flex flex-col items-center z-50">
                    <ul className="mt-2 w-full h-fit pb-3 flex flex-col gap-2 border-b-2 border-[#ffffff4a]">
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex justify-between items-center hover:bg-[#80808048] ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/">
                                <div className="w-[37.5%] flex justify-center items-center">
                                    <Home color="white"/>
                                </div>
                                <p className="w-[62.5%] flex justify-start items-center">
                                    Home
                                </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex justify-between items-center hover:bg-[#80808048] ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/subscriptions">
                                <div className="w-[37.5%] flex justify-center items-center">
                                    <Rss color="white"/>
                                </div>
                                <p className="w-[62.5%] flex justify-start items-center">
                                    Subscriptions
                                </p>
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="mt-2 w-full h-fit pb-3 flex flex-col gap-2 border-b-2 border-[#ffffff4a]">
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex justify-between items-center hover:bg-[#80808048] ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/you">
                                <p className="w-[37.5%] text-[1.1rem] font-semi-bold flex justify-center items-center">
                                    You
                                </p>
                                <div className="w-[62.5%] flex justify-start items-center">
                                    <ArrowRight color="white"/>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex justify-between items-center hover:bg-[#80808048] ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/history">
                                <div className="w-[37.5%] flex justify-center items-center">
                                    <History color="white"/>
                                </div>
                                <p className="w-[62.5%] flex justify-start items-center">
                                    History
                                </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex justify-between items-center hover:bg-[#80808048] ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/playlists">
                                <div className="w-[37.5%] flex justify-center items-center">
                                    <ListVideo color="white"/>
                                </div>
                                <p className="w-[62.5%] flex justify-start items-center">
                                    Playlists
                                </p>
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="mt-2 w-full h-fit pb-3 flex flex-col gap-2 border-b-2 border-[#ffffff4a]">
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex justify-between items-center hover:bg-[#80808048] ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/watch-later">
                                <div className="w-[37.5%] flex justify-center items-center">
                                    <Clock color="white"/>
                                </div>
                                <p className="w-[62.5%] flex justify-start items-center">
                                    Watch Later
                                </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex justify-between items-center hover:bg-[#80808048] ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/liked-videos">
                                <div className="w-[37.5%] flex justify-center items-center">
                                    <ThumbsUp color="white"/>
                                </div>
                                <p className="w-[62.5%] flex justify-start items-center">
                                    Liked Videos
                                </p>
                            </NavLink>
                        </li>
                    </ul>

                    {/* <ul className="mt-2 w-full h-fit pb-3 flex flex-col gap-2 border-b-2 border-[#ffffff4a]">
                        subscriptions
                    </ul> */}

                    <ul className="mt-2 w-full h-fit pb-3 flex flex-col gap-2 border-b-2 border-[#ffffff4a]">
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex justify-between items-center hover:bg-[#80808048] ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/settings">
                                <div className="w-[37.5%] flex justify-center items-center">
                                    <Settings color="white"/>
                                </div>
                                <p className="w-[62.5%] flex justify-start items-center">
                                    Settings
                                </p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                :
                <div className="w-[6%] h-[92%] bg-black text-white text-xs font-bold flex flex-col items-center">
                    <div className="mt-5 w-full h-[90%]">
                        <ul className="flex flex-col gap-8">
                            <li>
                                <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex flex-col justify-between hover:bg-[#80808048] items-center ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/">
                                    <Home/>
                                    <p className="mt-2">
                                        Home
                                    </p>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex flex-col justify-between hover:bg-[#80808048] items-center ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/subscriptions">
                                    <Rss/>
                                    <p className="mt-2">
                                        Subscriptions
                                    </p>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                className={({ isActive }) =>
                                    `p-2 flex flex-col justify-between hover:bg-[#80808048] items-center ${isActive ? 'bg-[#bababa55] hover:bg-[#bababa55]' : ''}`
                                }
                                to="/you">
                                    <CircleUserRound/>
                                    <p className="mt-2">
                                        You
                                    </p>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                </div>
            }
        </>
    )
}

export default Sidebar