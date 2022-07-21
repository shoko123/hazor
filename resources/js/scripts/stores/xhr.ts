import axios from 'axios';
import { defineStore } from 'pinia'

type TXhrMethod = "get" | "put" | "post" | "delete"

export const useXhrStore = defineStore('xhr', {
  state: () => {
    return {
      carousel: 'xxx',
      baseUrl: '',
      bucketUrl: ''
    }
  },

  actions: {
    setBaseUrl(baseUrl: String) {
      console.log(`xhr.setBaseUrl to: ${baseUrl}`)
      this.$state.baseUrl = baseUrl + '/api/'
    },

    async send(endpoint: string, method: TXhrMethod, data?: object) {
      console.log(`xhr.send() endpoint: ${this.$state.baseUrl + endpoint}`)
      return axios({
        url: this.$state.baseUrl + endpoint,
        method: method,
        data: (typeof data === undefined) ? null : data
      }).then(res => { 
        //console.log(`xhr success. res: ${JSON.stringify(res, null, 2)}`); 
        return res;
      }
      ).catch(err => { console.log(`xhr error. err: ${JSON.stringify(err, null, 2)}`); throw err; });
    },
  },
})
