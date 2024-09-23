


export const setPhoto__Update = (file_id) => {
  return {
    $set: {
      "photo.file_id": file_id
    }
  }
};

export const unsetPhoto__Update = (file_id) => {
  return {
    $unset: {
      "photo": 1
    }
  }
};


export const getPhoto__Selector = () => {
  return {
    photo: 1
  }
};


export const searchByName__Filter = (search) => {
  if(typeof search !== "string" || search.length === 0) return {};
  return {
    name: new RegExp(search, "im")
  };
}