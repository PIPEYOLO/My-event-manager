


const maxFileSize = parseInt(globalThis.window != undefined ? import.meta.env.PUBLIC_FILE_UPLOADED_MAX_SIZE : process.env.PUBLIC_FILE_UPLOADED_MAX_SIZE); 

export function validateFile({ data }) {
  if(data.length > maxFileSize) {
    return { isValid: false, message: `File must not exceed ${maxFileSize} bytes`};
  };

  return { isValid: true };
}