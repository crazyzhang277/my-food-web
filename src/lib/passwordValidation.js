export function validatePasswordConfirmation(password, confirmationPassword) {
  return password === confirmationPassword ? null : '两次输入的密码不一致';
}
