export const shouldIgnoreId = (id) => {
  return id === 'create';
};

export const getIdFromModel = (prop) => {
  if (!prop) {
    return null;
  }

  if (typeof prop === 'string') {
    return prop;
  }

  return prop._id;
};

export const findByModelIdPredicate = (findModel) => {
  return (each) => each._id === findModel._id;
};
