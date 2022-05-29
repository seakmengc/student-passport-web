const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export const getProfileUrl = (user) => {
  if (!user.profile) {
    return `https://avatars.dicebear.com/api/avataaars/${user._id}.svg`;
  }

  return `${apiBaseUrl}upload/${user.profile}/file`;
};
