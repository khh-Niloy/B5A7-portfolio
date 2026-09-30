const getProjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data;
  };
  
  export default getProjects;