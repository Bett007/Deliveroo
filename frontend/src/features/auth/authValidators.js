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

  if (!values.first_name?.trim()) {
    errors.first_name = "First name is required.";
  }

  if (!values.last_name?.trim()) {
    errors.last_name = "Last name is required.";
  }

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

export function validateForgotPasswordForm(values) {
  const errors = {};
  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  }
  return errors;
}

export function validateResetPasswordForm(values) {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  }

  if (!values.code?.trim()) {
    errors.code = "Reset code is required.";
  } else if (!/^\d{6}$/.test(values.code.trim())) {
    errors.code = "Reset code must be 6 digits.";
  }

  if (!values.new_password?.trim()) {
    errors.new_password = "New password is required.";
  } else if (values.new_password.trim().length < 8) {
    errors.new_password = "Password must be at least 8 characters long.";
  }

  if (!values.confirm_password?.trim()) {
    errors.confirm_password = "Please confirm your password.";
  } else if (values.confirm_password !== values.new_password) {
    errors.confirm_password = "Passwords do not match.";
  }

  return errors;
}
