import axios, { AxiosRequestConfig } from 'axios';

export function axiosInit() {
  axios.interceptors.request.use(axiosIntercepter);
}

const axiosIntercepter = (config: AxiosRequestConfig) => {
  if (config.url.includes('undefined') || config.url.includes('null') || config.url === undefined) {
    throw new Error(`Request url includes undefined or null - [${config.url}]`);
  }
  return config;
};
