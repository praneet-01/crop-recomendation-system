import axiosInstance from './axiosInstance'

export const getProfileAPI = () => axiosInstance.get('/profile/')
export const updateProfileAPI = (data) => axiosInstance.patch('/profile/', data)
export const changePasswordAPI = (data) => axiosInstance.post('/profile/change-password/', data)
