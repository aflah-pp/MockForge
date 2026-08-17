import api from "@/service/api";

export async function getFields(projectSlug, resourceSlug) {
  const response = await api.get(`/projects/${projectSlug}/resources/${resourceSlug}/fields/`);

  return response.data;
}

export async function getField(projectSlug, resourceSlug, fieldSlug) {
  const response = await api.get(
    `/projects/${projectSlug}/resources/${resourceSlug}/fields/${fieldSlug}/`,
  );

  return response.data;
}

export async function createField(projectSlug, resourceSlug, data) {
  const response = await api.post(
    `/projects/${projectSlug}/resources/${resourceSlug}/fields/`,
    data,
  );

  return response.data;
}

export async function updateField(projectSlug, resourceSlug, fieldSlug, data) {
  const response = await api.patch(
    `/projects/${projectSlug}/resources/${resourceSlug}/fields/${fieldSlug}/`,
    data,
  );

  return response.data;
}

export async function deleteField(projectSlug, resourceSlug, fieldSlug) {
  await api.delete(`/projects/${projectSlug}/resources/${resourceSlug}/fields/${fieldSlug}/`);
}

export async function getGenerators() {
  const response = await api.get("/generators/");

  return response.data;
}
