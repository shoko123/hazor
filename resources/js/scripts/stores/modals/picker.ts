// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useModuleStore } from '../module'


export const usePickerStore = defineStore('picker', () => {

  let open = ref<boolean>(false)


    const pickerInfo = computed(() => {
      return {
        isOpen: open.value,
        header: "picker header",
       
      }
    })


  function yy(openLB: boolean)  {
    open.value = openLB
  }
 
  return { pickerInfo, yy }
})
