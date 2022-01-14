export default function getUrlParameter(param: string) {
  const url = new URL(window.location.href);
  const c = url.searchParams.get(param);
  return c;
}
