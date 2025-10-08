const getSkills = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/skills/skills`, {
      next: { tags: ["skills"] },
    });
    const data = await res.json();
    return data;
  };
  
  export default getSkills;