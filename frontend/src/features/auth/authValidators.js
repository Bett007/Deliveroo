export function validateLoginForm(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateRegisterForm(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required.";
  } else if (values.password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (!values.role) {
    errors.role = "Account type is required.";
  }

  return errors;
}
