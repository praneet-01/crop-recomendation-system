import axiosInstance from './axiosInstance'

export const registerAPI = (data) => axiosInstance.post('/auth/register/', data)
export const loginAPI = (data) => axiosInstance.post('/auth/login/', data)
export const logoutAPI = (refresh) => axiosInstance.post('/auth/logout/', { refresh })
