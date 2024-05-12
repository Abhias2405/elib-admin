import axios from 'axios';
import useTokenStore from '@/store';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useTokenStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (data: { email: string; password: string }) =>
    api.post('/api/users/login', data);

export const register = async (data: { name: string; email: string; password: string }) =>
    api.post('/api/users/register', data);

export const getBooks = async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) =>
    api.get(`/api/books/user-books?page=${page}&limit=${limit}`);

export const createBook = async (data: FormData) =>
    api.post('/api/books', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const deleteBook = async (bookId: string) =>
    api.delete(`/api/books/${bookId}`);


export const updateBook = async (bookId: string, data: FormData) =>
    api.patch(`/api/books/${bookId}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const getBookById = async (bookId: string) =>
    api.get(`/api/books/${bookId}`);