import { store } from "@/store";
import { en } from "element-plus/es/locale";
import { computed } from "vue";

export const lang = computed(() => store.state.config.lang)


export function l(chinses:string, english:string) {
  return lang? chinses : english
}