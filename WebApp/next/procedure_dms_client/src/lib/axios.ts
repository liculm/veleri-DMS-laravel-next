import Axios, { AxiosInstance } from 'axios'

const axios: AxiosInstance = Axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
})

export default axios
