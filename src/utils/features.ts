import getUrlParameter from './getUrlParameter';

export function featureRunning(feature: string) {
  const urlParam = getUrlParameter(feature);

  if (parseInt(urlParam) === 1) {
    return true;
  } else if (parseInt(urlParam) === 0) {
    return false;
  } else if (process.env['VUE_APP_FEATURE_' + feature]) {
    return true;
  } else {
    return false;
  }
}
