const getAbout = async () => {
  try {
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";
    const res = await fetch(`${baseApi}/about/about-content`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data.data)) {
      return data.data[0] || null;
    }
    return data.data || null;
  } catch (err) {
    console.error("Failed to fetch about data:", err);
    return null;
  }
};

export default getAbout;
