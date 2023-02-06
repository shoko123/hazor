import axios from 'axios';
import { defineStore } from 'pinia'
import { ref } from 'vue'

type TXhrMethod = "get" | "put" | "post" | "delete"

export const useXhrStore = defineStore('xhr', () => {
  let baseUrl = ref("")

  function setBaseUrl(base: String) {
    console.log(`xhr.setBaseUrl to: ${base}`)
    baseUrl.value = base + '/api/'
  }

  async function send(endpoint: string, method: TXhrMethod, data?: object) {
    console.log(`xhr.send() endpoint: ${baseUrl.value + endpoint}`)
    return axios({
      url: baseUrl.value + endpoint,
      method,
      data: (typeof data === undefined) ? null : data
    })
      .then(res => {
        //console.log(`xhr success. res: ${JSON.stringify(res, null, 2)}`); 
        return res;
      })
      .catch(err => { console.log(`xhr error. err: ${JSON.stringify(err, null, 2)}`); throw err; });
  }
  return { setBaseUrl, send }
})
