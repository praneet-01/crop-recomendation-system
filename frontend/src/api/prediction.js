import axiosInstance from './axiosInstance'

export const predictAPI = (data) => axiosInstance.post('/predict/', data)
export const getHistoryAPI = () => axiosInstance.get('/history/')
