// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useModuleStore } from '../module'


export const usePickerStore = defineStore('picker', () => {

  let isOpen = ref<boolean>(false)


    const pickerInfo = computed(() => {
      return {
        header: "picker header",
       
      }
    })


  function yy(openLB: boolean)  {
    isOpen.value = openLB
  }
 
  return { isOpen, pickerInfo, yy }
})
