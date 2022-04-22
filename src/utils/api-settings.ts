import axios, { AxiosRequestConfig } from 'axios';

import { appLogger } from '@/utils/logging';

export function axiosInit() {
  axios.interceptors.request.use(axiosIntercepter);
}

const falsyRegex = /([=/]+undefined|[=/]+null)+/;
const axiosIntercepter = (config: AxiosRequestConfig) => {
  if (falsyRegex.test(config.url) || config.url === undefined) {
    const error = new Error(`Url includes falsy value - [${config.url}]`);
    appLogger.reportSingleError(error);
    throw error;
  }
  return config;
};
