// React and state logic
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from './store/slices/authSlice'

// Routing
import { Route, Routes } from 'react-router-dom'

//State
import { useState } from 'react'

// Pages
import Landing from './pages/Landing'
import Register from './pages/Register'
import Search from './pages/Search'
import Profile from './pages/Profile'
import UserInfo from './pages/UserInfo'
import Login from './pages/Login'
import Verificacion from './pages/Verificacion'
import PasswordRecovery from './pages/PasswordRecovery'
import CodeVerification from './pages/CodeVerification'
import Layout from './components/Layout'

import apiService from './services/apiService'
import getUserFromLocalStorage from './utils/getUser'

const App = () => {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (text) => {
    setSearchText(text)
    const results = await apiService.searchProducts({ nombre: text })
    setSearchResults(results)
  }

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromLocalStorage()
      dispatch(setAuthUser(user))
    }
    fetchUser()
  }, [dispatch])

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout searchText={searchText} onSearch={handleSearch} />}
      >
        <Route index element={<Landing />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="userInfo" element={<UserInfo />} />
        <Route path="verificacion" element={<Verificacion />} />
        <Route path="verificationCode/:token?" element={<CodeVerification />} />
        <Route path="passwordRecovery/:token" element={<PasswordRecovery />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="search"
          element={<Search searchResults={searchResults} name={searchText} />}
        />
        <Route path="verificacionCode/:token" element={<CodeVerification />} />
        <Route path="passwordRecovery/:token" element={<PasswordRecovery />} />
      </Route>
    </Routes>
  )
}

export default App
