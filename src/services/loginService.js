// Comunicates the front-end with the back-end
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

import axios from "axios"

const loginUser = async (data) =>{
    const request = await axios.post(API_URL + '/login', data);
    return request
}

export default {
    loginUser
}