const getEachBlog = async (id: string) => { const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${id}`); const data = await res.json();
  return data.data;
};

export default getEachBlog;
