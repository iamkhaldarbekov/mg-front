import axios from 'axios';

const URL = "http://localhost:5000";

const api = axios.create({
    baseURL: URL
});

api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('acstkn')}`;
    
    return config;
});

export {api};