import axios from 'axios';

const URL = "https://mg-back.onrender.com";

const api = axios.create({
    baseURL: URL
});

api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('acstkn')}`;
    
    return config;
});

export {api};