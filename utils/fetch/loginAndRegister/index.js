import { fetchServer } from "../main";


export function login(loginData) {
  return fetchServer("/login", "POST", { data: loginData });
}

export function register(registerData) {
  return fetchServer("/register", "POST", { data: registerData });
}


export function logout() {
  return fetchServer("/logout", "POST");
}