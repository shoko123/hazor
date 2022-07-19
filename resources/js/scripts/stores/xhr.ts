// stores/media.js
import axios from 'axios';
import { defineStore } from 'pinia'

type Nullable<T> = T | null;


interface XhrRequest {
  endpoint: string,
  method: "get" | "put" | "post" | "delete",
  data: Nullable<number>
}

export const useXhrStore = defineStore('xhr', {
  state: () => {
    return { carousel: 'xxx',
            baseUrl: '',
            bucketUrl: '' }
  },
 
  actions: {
    setBaseUrl(baseUrl: String) {
      console.log(`xhr.setBaseUrl to: ${baseUrl}`)
      this.$state.baseUrl = baseUrl + '/api/'
    },
    
    async send(r: XhrRequest) {
      console.log(`xhr.send() full endpoint: ${this.$state.baseUrl + r.endpoint}`)
        return axios({
            url: this.$state.baseUrl + r.endpoint,
            method: r.method,
            data: r.data,
        }).then(res => { console.log(`xhr success. res: ${JSON.stringify(res, null, 2)}`); return res; }
        ).catch(err => { console.log(`xhr error. err: ${JSON.stringify(err, null, 2)}`); throw err; });
    },
  },
})
