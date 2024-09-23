import { fetchServer } from "../main";




export function getSpecificUser(_id) {
  return fetchServer(`/user/${_id}`);
}



export function getUsers({ search="", skip=0, limit=10 }) {
  return fetchServer(`/user?search=${search}&skip=${skip}&limit=${limit}`);
}