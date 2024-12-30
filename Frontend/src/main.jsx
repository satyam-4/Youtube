import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import { Provider } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import store from "./app/store.js"

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
