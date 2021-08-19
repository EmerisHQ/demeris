import { useCookie } from 'vue-cookie-next';
import { event as gtagevent, pageview as gtagpageview } from 'vue-gtag';

//const { getCookie } = useCookie();
// eslint-disable-next-line @typescript-eslint/ban-types
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export function event(...args: ArgumentTypes<typeof gtagevent>) {
  const canTrack = true; // TODO: replace with getCookie
  if (canTrack) {
    return gtagevent(...args);
  } else {
    return;
  }
}
export function pageview(...args: ArgumentTypes<typeof gtagpageview>) {
  const canTrack = true; // TODO: replace with getCookie
  if (canTrack) {
    return gtagpageview(...args);
  } else {
    return;
  }
}
