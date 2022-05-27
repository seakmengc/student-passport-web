export const showSnackbar = (data, error, enqueueSnackbar) => {
  if (error) {
    enqueueSnackbar(data.message ?? 'Something went wrong!', {
      variant: 'error',
    });
  } else {
    enqueueSnackbar('Saved!', {
      variant: 'success',
    });
  }
};
