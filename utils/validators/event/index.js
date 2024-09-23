

export function validateEventName(name) {
  if(name.length === 0 || name.length > 50) {
    return {
      isValid: false,
      message: "Event name must be from 1 to 50 characters"
    }
  };

  return {
    isValid: true
  }
}



export function validateEventDescription(description) {
  if(description.length > 250) {
    return {
      isValid: false,
      message: "Event description must be at most 250 characters"
    }
  };

  return {
    isValid: true
  }
}


