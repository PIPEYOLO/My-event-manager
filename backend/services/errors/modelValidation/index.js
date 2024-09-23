


export function getDocumentValidationErrorsInStringFormat(validation) {
  return Object.entries(validation.errors).map(
    ([field, error]) => {
      let informationToBeReturned = error.reason ?? error.message;
      /*
        I prioritize the error.reason because it give a more proper information on why the validation failed, and if it is undefined it is returned the error.message

        Note: 
          - take into account that mongo standard validators (required, immutable, enum) do not have a "reason" but the have a "message".
          - Also, have to know that the custom validators can have a reason if they "throw smth" or not, if they 'return false'
      */


      return `Problem with field ${field}: ${informationToBeReturned}`;
    }
  ).join(", ");
}