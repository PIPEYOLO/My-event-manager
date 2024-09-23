


export function validateInvitationDescription(description) {
  if(description.length > 100) {
    return {
      isValid: false,
      message: "Invitation description must be at most 100 characters"
    }
  };

  return { isValid: true };
}