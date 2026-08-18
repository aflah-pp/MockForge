import api from "@/service/api";

export async function getDashboard() {
  const response = await api.get("dashboard/");
  return response.data;
}
