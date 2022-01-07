import { VueCookieNext } from 'vue-cookie-next';
import { event as gtagevent, pageview as gtagpageview } from 'vue-gtag';

// eslint-disable-next-line @typescript-eslint/ban-types
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export function event(...args: ArgumentTypes<typeof gtagevent>) {
  const canTrack = VueCookieNext.getCookie('cookie-consent-accepted');
  if (canTrack && canTrack == 'true') {
    if ((args[1] as any).event_category == 'transactions') {
      gtagpageview({
        page_title: (args[1] as any).event_label,
        page_path: '/virtual/transactions/' + args[0] + '/' + (args[1] as any).event_label,
      });
    }
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
