import { fetchServer } from "../main";



export function createEvent(eventData) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(eventData)) {
    formData.append(key, value);
  };
  return fetchServer(`/event`, "POST", { data: formData, headers: { "Content-Type": "multipart/form-data" } });
}

export function editEvent(eventData) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(eventData)) {
    formData.append(key, value);
  };
  return fetchServer(`/event/${eventData._id}`, "PATCH", { data: formData, headers: { "Content-Type": "multipart/form-data" } });
}


export function getEvents({ type, skip, limit=10, subscribed, closest, search, created }) {
  return fetchServer(`/event?type=${type}&skip=${skip}&limit=${limit}&subscribed=${subscribed}&closest=${closest}&search=${search}&created=${created}`);
}

export function getSpecificEvent(_id, { action="itself" }) {
  return fetchServer(`/event/${_id}?action=${action}`);
};

export function getEventSubscribers(_id, { skip=0, limit=10 }) {
  return fetchServer(`/event/${_id}?action=subscribedUsers&skip=${skip}&limit=${limit}`);
}

export function joinEvent(_id) {
  return fetchServer(`/event/${_id}/join`, "PATCH");
};

export function leaveEvent(_id) {
  return fetchServer(`/event/${_id}/leave`, "PATCH");
};
