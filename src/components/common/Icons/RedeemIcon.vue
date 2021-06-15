<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0)">
      <path
        d="M2.96606 1.13L2.23706 6.927L7.92906 5.341"
        style="stroke: currentColor"
        stroke-miterlimit="10"
        stroke-linecap="square"
      />
      <path
        d="M2.237 6.92695C3.47619 4.53973 5.54709 2.68926 8.05815 1.72541C10.5692 0.761563 13.3464 0.751135 15.8646 1.6961C18.3828 2.64106 20.4676 4.47592 21.7247 6.85377C22.9817 9.23161 23.3241 11.9876 22.6869 14.6008C22.0497 17.2139 20.4772 19.503 18.2666 21.0353C16.0561 22.5676 13.3608 23.2369 10.6902 22.9166C8.01965 22.5963 5.55899 21.3087 3.77345 19.2972C1.98791 17.2857 1.00124 14.6896 1 11.9999"
        stroke="black"
        stroke-miterlimit="10"
      />
      <g filter="url(#filter0_d)">
        <rect x="-8" y="-7.99927" width="40" height="40" rx="20" fill="white" />
        <g clip-path="url(#clip1)">
          <path
            d="M7.58472 5.50732L2.92865 5.51734L2.91863 0.861277"
            style="stroke: currentColor"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.06003 5.50848C4.62491 3.32089 6.93707 1.78245 9.55934 1.18405C12.1816 0.585642 14.9323 0.968743 17.2912 2.26092C19.6502 3.55309 21.454 5.66478 22.3615 8.19673C23.2691 10.7287 23.2175 13.5054 22.2166 16.0019C21.2156 18.4984 19.3347 20.5417 16.9294 21.7454C14.5241 22.9491 11.7611 23.2298 9.16283 22.5344C6.56459 21.839 4.31115 20.2158 2.82857 17.9716"
            stroke="black"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4.50033 10.5015L4.5 13.5015C4.5 14.6061 7.85786 15.5015 12 15.5015C16.1421 15.5015 19.5 14.6061 19.5 13.5015V10.5017"
            style="stroke: currentColor"
          />
          <ellipse cx="12" cy="10.5015" rx="7.5" ry="2" style="stroke: currentColor" />
        </g>
      </g>
      <path
        d="M4.50033 10.5007L4.5 13.5008C4.5 14.6053 7.85786 15.5008 12 15.5008C16.1421 15.5008 19.5 14.6053 19.5 13.5008V10.5009"
        style="stroke: currentColor"
      />
      <ellipse cx="12" cy="10.5007" rx="7.5" ry="2" style="stroke: currentColor" />
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="-29"
        y="-22.9993"
        width="88"
        height="88"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dx="3" dy="9" />
        <feGaussianBlur stdDeviation="12" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <clipPath id="clip0">
        <rect width="24" height="24" fill="white" />
      </clipPath>
      <clipPath id="clip1">
        <rect width="24" height="24" fill="white" transform="translate(0 0.000732422)" />
      </clipPath>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RedeemIcon',
});
</script>
<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
