
export function validatePassword(password) {
  if (password.length < 8 || password.length > 32) {
    return {
      isValid: false,
      message: "Password must be between 8 and 32 characters."
    };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one letter."
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number."
    };
  }

  if (/\s/.test(password)) {
    return {
      isValid: false,
      message: "Password must not contain spaces."
    };
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(password)) {
    return {
      isValid: false,
      message: "Password can only include letters, numbers, '_', '-', and '.'."
    };
  }

  return {
    isValid: true
  };
}


export function validateUsername(username) {
  if (typeof username !== "string") {
    return {
      isValid: false,
      message: "Username must be a string"
    }
  };
  if (username.length < 8 || username.length > 32) {
    return {
      isValid: false,
      message: "Username must be between 8 and 32 characters."
    };
  }

  if (!/[a-zA-Z]/.test(username)) {
    return {
      isValid: false,
      message: "Username must contain at least one letter."
    };
  }

  if (!/[0-9]/.test(username)) {
    return {
      isValid: false,
      message: "Username must contain at least one number."
    };
  }

  if (/\s/.test(username)) {
    return {
      isValid: false,
      message: "Username must not contain spaces."
    };
  }

  if (!/^[a-zA-Z0-9_.\-!#$%&/]+$/.test(username)) {
    return {
      isValid: false,
      message: "Username can only include letters, numbers, '_', '-', '.', '!', '#', '$', '%', '&', '/'."
    };
  }

  return {
    isValid: true
  };
}

