// app.js
//Stores data common to the whole app:
//accessibility, bucketUrl, carousel, 
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { computed } from 'vue'

export const useMainStore = defineStore('main', () => {

  let accessibility = ref({ authorizedUsersOnly: true, readOnly: false })
  let bucketUrl = ref(null)
  let action = true

  function appInit(data: any) {
    accessibility = data.accessibility
    bucketUrl = data.bucketUrl
  }

  const isLoading = computed(() => {
    return action
  })

  const subMenu = computed(() => {
    return action
  })

  const authorizedUsersOnly = computed(() => {
    return accessibility.value.authorizedUsersOnly
  })

  return { authorizedUsersOnly, bucketUrl, appInit, isLoading, subMenu }
})

