import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  authUser: null,
  isLoggedIn: false,
  isAdmin: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload
    },
    clearAuth: (state) => {
      state.authUser = null
      state.isLoggedIn = false
      state.isAdmin = false
    },
  },
})

export const { setAuthUser, setIsLoggedIn, setIsAdmin, clearAuth } =
  authSlice.actions
export default authSlice.reducer
