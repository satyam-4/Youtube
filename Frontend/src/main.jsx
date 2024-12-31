import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import Subscriptions from './pages/Subscriptions.jsx'
import { Provider } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import store from "./app/store.js"
import You from './pages/You.jsx'
import History from './pages/History.jsx'
import Playlists from './pages/Playlists.jsx'
import WatchLater from './pages/WatchLater.jsx'
import LikedVideos from './pages/LikedVideos.jsx'
import Settings from './pages/Settings.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: 
    [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        )
      },
      {
        path: "/subscriptions",
        element: <Subscriptions/>
      },
      {
        path: "/you",
        element: <You/>
      },
      {
        path: "/history",
        element: <History/>
      },
      {
        path: "/playlists",
        element: <Playlists/>
      },
      {
        path: "/watch-later",
        element: <WatchLater/>
      },
      {
        path: "/liked-videos",
        element: <LikedVideos/>
      },
      {
        path: "/settings",
        element: <Settings/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
