const getBlogs = async () => {
  try {
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";
    const res = await fetch(`${baseApi}/blog`, {
      cache: "no-store",
    });
    if (!res.ok) return { fullData: [], slicedData: [] };
    const data = await res.json();
    const fullData = data.data || [];
    const slicedData = fullData.slice(0, 2);
    return { fullData, slicedData };
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    return { fullData: [], slicedData: [] };
  }
};

export default getBlogs;
