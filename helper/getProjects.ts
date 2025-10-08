const getProjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`);
    const data = await res.json();
    console.log(data.data);
    return data.data;
  };
  
  export default getProjects;