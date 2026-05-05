import axiosInstance from './axiosInstance'

export const getAdminStatsAPI = () => axiosInstance.get('/admin/stats/')
export const getAdminUsersAPI = () => axiosInstance.get('/admin/users/')
export const getAdminUserDetailAPI = (id) => axiosInstance.get(`/admin/users/${id}/`)
export const getAdminPredictionsAPI = () => axiosInstance.get('/admin/predictions/')
