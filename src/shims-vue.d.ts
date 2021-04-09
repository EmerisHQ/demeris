/* eslint-disable */
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { NavigatorState } from './store/index'

declare module '*.vue' { 
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare global {  
  interface Window {  Vue: any  }
}
declare module '@vue/runtime-core' {
  // Declare your own store states.
  
  interface ComponentCustomProperties {
    $store: Store<NavigatorState>,
    _depsLoaded: boolean
  }
}