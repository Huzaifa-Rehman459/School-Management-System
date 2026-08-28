const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const vercelAPI = "https://school-management-system-sooty-seven.vercel.app/";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${vercelAPI}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
