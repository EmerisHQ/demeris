<script lang="ts">
export default function () {

  //TODO: get price
  function getCoinPrice(coin:string) {
    if(coin) {
      return 2
    }
  }

  function getCoinDollarValue(coin:string ,amount:number) {
      const price = getCoinPrice(coin)
      if(amount) {
        return `$${(amount * price).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      } else {
        return ''
      }
    }

  return {
    getCoinPrice, getCoinDollarValue
  };
}
</script>