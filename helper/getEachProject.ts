const getEachProject = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects/${id}`, {
      next: { tags: ["projects"] },
    });
    const data = await res.json();
    return data.data;
  };
  
  export default getEachProject;