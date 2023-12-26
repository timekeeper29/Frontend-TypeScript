import axios from 'axios';
import { User } from '../models/general';

const instance = axios.create({
    baseURL: 'http://localhost:8000', // Replace with your API server's URL
});

export const signupAPI = async (user: User) => {
    const { email, password } = user
    const response = await instance.post('/signup', { email, password });
    return response
}

export const loginAPI = async (email: string, password: string) => {
    const response = await instance.post('/auth/login', { email, password });
    console.log(document.cookie)
    return response
} 