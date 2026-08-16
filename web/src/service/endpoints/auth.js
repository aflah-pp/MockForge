import api from "../api";

export const registerUser = async (payload) => {
  const { data } = await api.post("/users/register/", payload);

  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/users/login/", payload);

  return data;
};

export const refreshUserToken = async () => {
  const { data } = await api.post("/users/refresh/");

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/users/me/");

  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/users/logout/");

  return data;
};

export const logoutAllUsers = async () => {
  const { data } = await api.post("/users/logout-all/");

  return data;
};

export const updateCurrentUser = async (payload) => {
  const { data } = await api.patch("/users/me/update/", payload);

  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.post("/users/me/change-password/", payload);

  return data;
};

export const verifyEmail = async (payload) => {
  const { data } = await api.post("/users/me/verify-email/", payload);

  return data;
};

export const deactivateAccount = async () => {
  const { data } = await api.post("/users/me/deactivate/");

  return data;
};
