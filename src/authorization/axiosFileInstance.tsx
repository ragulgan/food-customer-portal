import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 180000,
    headers: {
        "Cache-control": "no-cache",
        "Content-type": "multipart/form-data",
        "escriptMasterDataType": "merchants",
    }
});


instance.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('AUTH_TOKEN') || '';
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
}, function (error) {
    return Promise.reject(error);
})

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 440 || error.response.status === 401) {
        sessionStorage.clear();
        window.location.replace('/login?code=sessionexpired')
    }
    return Promise.reject(error);
});

export default instance;