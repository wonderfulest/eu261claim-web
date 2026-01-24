declare module 'swiper/vue' {
  import { DefineComponent } from 'vue'
  export const Swiper: DefineComponent<any, any, any>
  export const SwiperSlide: DefineComponent<any, any, any>
}

declare module 'swiper/modules' {
  export const Autoplay: any
  export const EffectFade: any
  export const FreeMode: any
  export const Pagination: any
  export const Navigation: any
  export const Thumbs: any
}
