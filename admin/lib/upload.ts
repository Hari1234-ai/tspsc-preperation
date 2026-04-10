import { API_URL } from "./constants";

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL.replace("/api/v1", "")}/api/v1/uploads/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  // Return the full URL
  const baseUrl = API_URL.replace("/api/v1", "");
  return `${baseUrl}${data.url}`;
}
