const getBlogs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`, {
    next: { tags: ["blogs"] }
  });
  const data = await res.json();
  return data.data;
};

export default getBlogs;
