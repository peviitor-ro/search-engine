import axios from "axios";

export default axios.create({
  baseURL: 'https://api.peviitor.ro/v1/',
  timeout: 3000,
  headers: {}
})