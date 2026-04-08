export function saveAuth(token, user, account) {
  localStorage.setItem("wc_bank_token", token);
  localStorage.setItem("wc_bank_user", JSON.stringify(user));
  localStorage.setItem("wc_bank_account", JSON.stringify(account));
}

export function getToken() {
  return localStorage.getItem("wc_bank_token");
}

export function getUser() {
  const user = localStorage.getItem("wc_bank_user");
  return user ? JSON.parse(user) : null;
}

export function getAccount() {
  const account = localStorage.getItem("wc_bank_account");
  return account ? JSON.parse(account) : null;
}

export function logoutUser() {
  localStorage.removeItem("wc_bank_token");
  localStorage.removeItem("wc_bank_user");
  localStorage.removeItem("wc_bank_account");
}