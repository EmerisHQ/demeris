<script lang="ts">
export default function() {
  //TODO: get price
  function getCoinPrice(coin: string) {
    if (coin) {
      return 2;
    } else {
      return 0;
    }
  }

  function getCoinDollarValue(coin: string, amount: number) {
    if (coin && amount) {
      const price = getCoinPrice(coin);
      return `$${(amount * price).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    } else {
      return '';
    }
  }

  return {
    getCoinPrice,
    getCoinDollarValue,
  };
}
</script>
