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

    //console.log(`setAxios defaults: ${JSON.stringify(axios.defaults, null, 2)}`); 
    return axios.get(`/sanctum/csrf-cookie`)
      .catch(err => {
        console.log(`failed to set csrf cookie. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      });
    //console.log(`setAxios success. res: ${JSON.stringify(res, null, 2)}`); 
  }

  async function send(endpoint: string, method: TXhrMethod, data?: object) {
    let fullUrl = endpoint.substring(0, 8) === 'fortify/' ? `${axios.defaults.baseURL}/${endpoint}` : `${axios.defaults.baseURL}/api/${endpoint}`
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
      .catch(err => {
        consoleLogErrors(err)
        throw err
      });
  }

  async function consoleLogErrors(err: any) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (err.response) {
      console.log(`axios.err.response status: ${err.response.status} \ndata: ${JSON.stringify(err.response.data, null, 2)}`);
      //console.log(`headers: ${err.response.headers}`)
    } else if (err.request) {
      // The request was made but no response was received
      console.log(`axios.err no response received request: ${JSON.stringify(err.request, null, 2)}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(`axios.Error: ${err.message}`);
    }
    //console.log(`axios.config: ${JSON.stringify(err.config, null, 2)}`);
  }

  return { setAxios, send }
})
