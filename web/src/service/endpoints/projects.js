import api from "../api";

export const getProjects = async () => {
  const { data } = await api.get("/projects/");

  return data;
};

export const getProject = async (slug) => {
  const { data } = await api.get(`/projects/${slug}/`);

  return data;
};

export const createProject = async (payload) => {
  const { data } = await api.post("/projects/", payload);

  return data;
};

export const renameProject = async (slug, payload) => {
  const { data } = await api.patch(`/projects/${slug}/rename/`, payload);

  return data;
};

export const deleteProject = async (slug) => {
  const { data } = await api.delete(`/projects/${slug}/`);

  return data;
};

export const publishProject = async (slug) => {
  const { data } = await api.post(`/projects/${slug}/publish/`);

  return data;
};

export const unpublishProject = async (slug) => {
  const { data } = await api.post(`/projects/${slug}/unpublish/`);

  return data;
};

export const toggleProjectPublish = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/toggle-publish/`);

  return data;
};
