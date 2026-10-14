const getProjects = async () => {
  try {
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";
    const res = await fetch(`${baseApi}/projects`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return [];
  }
};

export default getProjects;