import { fetchServer } from "../../../../utils/fetch/main";



export async function readFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener("load", ev => {
      resolve(ev.target.result);
    });
    fr.addEventListener("error", ev => {
      reject(ev.target.error);
    });
  })
}



export async function createFileFromUrl(url) {
  if(url === "" || url == undefined) return null;
  
  const response = await fetchServer(url, "GET", { __useBaseURL: false, __responseType: "arraybuffer" });
  const { status, data, headers } = response;
  if(status !== 200) return null;

  const blob = new Blob([ data ], { type: headers['content-type'] });
  
  const file = new File([ blob ], crypto.randomUUID(), { type: headers['content-type'] });  

  return file;
}