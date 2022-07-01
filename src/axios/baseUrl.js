import axios from 'axios';

const baseUrl = axios.create({ baseURL: 'https://api.peviitor.ro/v3/' });

export default baseUrl;