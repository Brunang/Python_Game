// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const validateCode = (code, minLength = 5) => {
  return code && code.trim().length >= minLength;
};

export const getValidationErrors = (data) => {
  const errors = {};

  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (data.password && !validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.username && !validateUsername(data.username)) {
    errors.username = 'Username must be 3+ characters, alphanumeric and underscore only';
  }

  if (data.code && !validateCode(data.code)) {
    errors.code = 'Code is too short or empty';
  }

  return errors;
};
