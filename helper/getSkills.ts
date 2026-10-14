const getSkills = async () => {
  try {
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";
    const res = await fetch(`${baseApi}/skills/skills`, {
      cache: "no-store",
    });
    if (!res.ok) return { data: [] };
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch skills:", err);
    return { data: [] };
  }
};

export default getSkills;