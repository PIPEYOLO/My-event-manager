

export const findInvitationsOfUser__Filter = (user_id, options={}) => {
  const defaultOptions = { type: "pending" };
  Object.assign(defaultOptions, options);
  const { type, search } = defaultOptions;

  let filter;
  if(type === "accepted" || type === "rejected" || type === "pending") {
    filter = { // get just the invitations that are of "type"
      "invitedUsers": { $elemMatch: { _id: user_id, usageState: type } }
    }
  }
  else filter = { "invitedUsers._id": user_id  }; // get all invitations

  if(search != undefined && search != "") {
    filter.description = new RegExp(search, "im")
  } 

  return filter;
}
