import { fetchServer } from "../main";


export function getSpecificInvitation(_id) {
  return fetchServer(`/invitation/${_id}`);
};

export function getInvitations({ type, skip=0, limit=10, search="", recent=true }) {
  return fetchServer(`/invitation?action=${type}&skip=${skip}&limit=${limit}&search=${search}&recent=${recent}`);
};

export function acceptInvitation(_id) {
  return fetchServer(`/invitation/${_id}/accept`, "PATCH");
};

export function rejectInvitation(_id) {
  return fetchServer(`/invitation/${_id}/reject`, "PATCH");
};


export function createInvitation(invitationData) {
  return fetchServer("/invitation", "POST", { data: invitationData  });
}
