export function required(value, label) {
  return value && String(value).trim() ? "" : `${label} is required.`;
}

export function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email) ? "" : "Enter a valid email address.";
}

export function validatePassword(password) {
  return password?.length >= 6 ? "" : "Password must be at least 6 characters.";
}
