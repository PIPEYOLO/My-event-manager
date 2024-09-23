import { Axios } from "axios";



export const axios = new Axios({
  baseURL:( globalThis.process?.env?.SERVER_HOST_URL ?? window.origin) + "/api", // it adapts the backend and the frontend
  timeout: 5000,
  withCredentials: true,
  transformRequest: [function (data, headers) {
    if(/json/.test(headers.getContentType())) return JSON.stringify(data);
    return data;
  }],

  transformResponse: [function (data, headers) {
    if(/json/.test(headers.getContentType())) return JSON.parse(data);
    return data;
  }],
});

export async function fetchServer(url="", method="GET", options) {
  const { data, headers, __useBaseURL, __responseType } = options ?? {};
  
  const defaultHeaders = { "Content-Type": "application/json" };
  Object.assign(defaultHeaders, headers ?? {});

  method = method.toUpperCase();

  let result;
  try {
    result = await axios.request({
      url,
      data: data,
      method,
      headers: defaultHeaders,
      baseURL: __useBaseURL === false ? "/" : axios.defaults.baseURL,
      responseType: __responseType ?? "json"
    })
  }
  catch(error) {
    console.log(error);
    if(error.code === 'ECONNABORTED') {
      result = {
        status: 408, // Código de estado para timeout
        data: {
          status: 400,
          error: {
            message: 'Request timed out. Please try again later.'
          }
        }
      };
    }
    else result = error.response;
  }

  if(import.meta.env.DEV) {
    console.log("params", arguments);
    console.log("response", result);
  }


  return result;

}