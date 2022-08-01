import axios from 'axios';

export const baseUrl = axios.create({ baseURL: 'https://api.peviitor.ro/v1/' });
