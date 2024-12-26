import React from "react"
import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import { Outlet } from "react-router-dom"
const App = () => {

    return (
        <>
            <Outlet/>
        </>
    )
}

export default App