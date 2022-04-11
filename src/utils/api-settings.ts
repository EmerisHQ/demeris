import axios, { AxiosRequestConfig } from 'axios';

export function axiosInit() {
  axios.interceptors.request.use(axiosIntercepter);
}

const falsyRegex = /(undefined|null)+/;
const axiosIntercepter = (config: AxiosRequestConfig) => {
  if (falsyRegex.test(config.url) || config.url === undefined) {
    throw new Error(`Request url includes undefined or null - [${config.url}]`);
  }
  return config;
};
