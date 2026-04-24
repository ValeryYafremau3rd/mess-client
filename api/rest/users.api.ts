import api from "./client";

export const createUser = async () => {
  const { data } = await api.post(`/users`);
  return data;
};

export const deleteUser = async () => {
  const { data } = await api.delete(`/users`);
  return data;
};

export const updateUser = async (user) => {
  const { data } = await api.patch(`/users`, user);
  return data;
};

export const fetchAllUsers = async () => {
  const { data } = await api.get(`/users`);
  return data;
};

export const getUserById = async (userId: number) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const fetchMyContacts = async () => {
  const { data } = await api.get(`/users/contacts`);
  return data;
};

export const addContact = async (contactId: number) => {
  const { data } = await api.post(`/users/contacts/${contactId}`, {});
  return data;
};

export const removeContact = async (contactId: number) => {
  const { data } = await api.delete(`/users/contacts/${contactId}`);
  return data;
};
