// React and state logic
import { useState } from 'react'

// Routing
import { Route, Routes } from 'react-router-dom'

// Pages
import Landing from './pages/Landing'
import Register from './pages/Register'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Verificacion from './pages/Verificacion'
import PasswordRecovery from './pages/PasswordRecovery'
import CodeVerification from './pages/CodeVerification'
import Layout from './components/Layout'
import ComparisonView from './pages/ComparisonView'
import Publish from './pages/Publish'
import ShoppingCart from './pages/ShoppingCart'

// Services
import apiService from './services/apiService'
import ProductPage from './pages/Product/Product'
import RequestResult from './pages/RequestResult'
import getUserFromLocalStorage from './utils/getUser'
import ProductRating from './pages/ProductRating'

const App = () => {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (text) => {
    setSearchText(text)
    const request = await apiService.searchProducts({ nombre: text })
    setSearchResults(request.results)
    console.log('request.results', request.results)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout searchText={searchText} onSearch={handleSearch} />}
      >
        <Route index element={<Landing />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="verificacion" element={<Verificacion />} />
        <Route path="verificationCode/:token?" element={<CodeVerification />} />
        <Route path="passwordRecovery/:token" element={<PasswordRecovery />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="search"
          element={<Search searchResults={searchResults} name={searchText} />}
        />
        <Route path="verificacionCode/:token" element={<CodeVerification />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="comparison/:id1/:id2" element={<ComparisonView />} />
        <Route
          path="requestResult/:type"
          element={<RequestResult message="Compra exitosa" />}
        />
        <Route path="passwordRecovery/:token" element={<PasswordRecovery />} />
        <Route path="publish" element={<Publish />} />
        <Route path="productRating" element={<ProductRating />} />
        <Route path="shoppingCart" element={<ShoppingCart />} />
      </Route>
    </Routes>
  )
}

export default App
