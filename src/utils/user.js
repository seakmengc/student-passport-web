const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export const getProfileUrl = (user) => {
  if (!user.profile) {
    // return `https://avatars.dicebear.com/api/avataaars/${user._id}.svg`;
    return '/images/avatars/' + Math.ceil((Math.random() * 100) % 8) + '.png';
  }

  return getUploadUrl(user.profile);
};

export const getUploadUrl = (uploadId) => {
  if (!uploadId) {
    return null;
  }

  return `${apiBaseUrl}upload/${uploadId}/file`;
};
