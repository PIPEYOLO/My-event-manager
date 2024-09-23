
export const findEventForCreator__Filter = (event_id, creator_id) => {
  return {
    _id: event_id,
    creator_id: creator_id
  }
}

export const findEventForUser__Filter = (event_id, user_id) => {
  return {
    _id: event_id,
    $or: [
      { isPublic: true },
      { "subscribedUsers._id": user_id },
      { creator_id: user_id }
    ]
  };
}

export const findEventsForUser__Filter = (user_id, { type, subscribed, search }) => {
  let filter = {
    $or: [
      { "subscribedUsers._id": user_id },
      { creator_id: user_id }
    ]
  };

  // type
  if(type === "outOfDate") {
    filter.startDate = { $lt: new Date() };
  }
  else if(type === "pending") {
    filter.startDate = { $gt: new Date() };
  };
  // else return all


  // Subscribed:
  if(subscribed === false) {
    filter.$or.unshift({ isPublic: true }); // return also the public events
  };

  // Search
  if(search.length > 0) {
    filter.name = new RegExp(search, "im");
  }
  
  // console.log(filter);
  return filter;
}


export const userCanJoinEvent__Filter = (event_id, user_id, withInvitation=false) => {
  const filter = {
    _id: event_id,
    "subscribedUsers._id": { $ne: user_id } // the user must not be already joined
  };
  if(withInvitation !== true) {
    filter.$or = [
      { creator_id: user_id }, // the creator can also join the event
      { isPublic: true } // the event must be public
    ];
  };

  return filter;
}

export const subscribeUserToEvent__Update = (subscriberEntity) => {
  return {
    $push: {
      subscribedUsers: {
        $each: [ subscriberEntity ],
        $position: 0
      }
    }
  }
}
export const unsubscribeUserFromEvent__Update = (subscriber_id) => {
  return {
    $pull: {
      subscribedUsers: {
        _id: subscriber_id
      }
    }
  }
};



export const getSpecificSubscriber__Selector = (user_id) => {
  return { 
    subscribedUsers: { $elemMatch: { _id: user_id } } 
  }
}

export const getEventPublicInfo__Selector = () => {
  return { name: 1, photo: 1, description: 1, isPublic: 1, startDate: 1, creator_id: 1 };
}

export const getSubscribedUsers__Selector = ({ skip, limit}) => {
  return { 
    subscribedUsers: { $slice: [ "$subscribedUsers", skip, limit ]}
  }
}

