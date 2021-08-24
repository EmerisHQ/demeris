import { VueCookieNext } from 'vue-cookie-next';
import { event as gtagevent, pageview as gtagpageview } from 'vue-gtag';

// eslint-disable-next-line @typescript-eslint/ban-types
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export function event(...args: ArgumentTypes<typeof gtagevent>) {
  const canTrack = VueCookieNext.getCookie('cookie-consent-accepted');
  if (canTrack && canTrack == 'true') {
    return gtagevent(...args);
  } else {
    return;
  }
}
export function pageview(...args: ArgumentTypes<typeof gtagpageview>) {
  const canTrack = VueCookieNext.getCookie('cookie-consent-accepted');
  if (canTrack && canTrack == 'true') {
    return gtagpageview(...args);
  } else {
    return;
  }
}
