export default function useCountry() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
