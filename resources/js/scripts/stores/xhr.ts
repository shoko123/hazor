import axios from 'axios';
import { defineStore } from 'pinia'
import { ref } from 'vue'

type TXhrMethod = "get" | "put" | "post" | "delete"

export const useXhrStore = defineStore('xhr', () => {

  async function setAxios() {
    axios.defaults.baseURL = `${window.location.protocol}//${window.location.host}`
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common['Accept'] = 'application/json'
    axios.defaults.withCredentials = true

    console.log(`setAxios defaults: ${JSON.stringify(axios.defaults, null, 2)}`); 
    const res = await axios.get(`/sanctum/csrf-cookie`) 
       .then(res => {
        console.log(`setAxios success. res: ${JSON.stringify(res, null, 2)}`); 
        return res;
      })
      .catch(err => { console.log(`failed to set csrf cookie. err: ${JSON.stringify(err, null, 2)}`); throw err; });
  }

  async function send(endpoint: string, method: TXhrMethod, data?: object) {
    let fullUrl = endpoint.substring(0,5) === 'auth/' ? `${axios.defaults.baseURL}/${endpoint}` : `${axios.defaults.baseURL}/api/${endpoint}`
    console.log(`xhr.send() endpoint: ${fullUrl}`)
    return axios({
      url: fullUrl,
      method,
      data: (typeof data === undefined) ? null : data
    })
      .then(res => {
        //console.log(`xhr success. res: ${JSON.stringify(res, null, 2)}`); 
        return res;
      })
      .catch(err => { console.log(`xhr error. err: ${JSON.stringify(err, null, 2)}`); throw err; });
  }
  return { setAxios, send }
})
