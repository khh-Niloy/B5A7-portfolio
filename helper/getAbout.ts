const getAbout = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/about/about-content`);
  const data = await res.json();
  return data.data[0];
};

export default getAbout;