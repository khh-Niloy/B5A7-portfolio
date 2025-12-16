const getBlogs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`, {
    next: { tags: ["blogs"] }
  });
  const data = await res.json();

  const fullData = data.data
  const slicedData = data.data.slice(0, 2)
  
  return {fullData, slicedData};
};

export default getBlogs;
