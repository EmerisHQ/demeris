export default {
  toUpperCase: (value: string) => {
    if (!value) return '';
    return value.toUpperCase();
  },
  getCoinName: (value: string) => {
    return value.substr(1).toUpperCase();
  },
};
