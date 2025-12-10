import api from "../lib/axios"

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),

  getRecentActivity: () => api.get("/dashboard/activity"),
}
