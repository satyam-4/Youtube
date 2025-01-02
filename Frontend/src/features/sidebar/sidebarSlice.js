import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isExpanded: localStorage.getItem("isExpanded") === "true",  // Tracks authentication status
}

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        toggleSidebarState: (state) => {
            state.isExpanded = !state.isExpanded
        }
    }
})

export const { toggleSidebarState } = sidebarSlice.actions
export default sidebarSlice.reducer