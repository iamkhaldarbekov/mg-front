import axios from 'axios';

const URL = "http://localhost:5000";

export const api = axios.create({
    baseURL: URL
});