export const getAuthHeader = () => {
  const token = JSON.parse(localStorage.getItem("accessToken"));

  if (token) {
    return { Authorization: "Bearer " + token };
    // for Node.js Express back-end
    // return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
};
