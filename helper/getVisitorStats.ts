const getVisitorStats = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/visitors/stats`, {
        cache: "no-store",
        credentials: "include",
    });
    const data = await res.json();
    return data.data;
  };
  
  export default getVisitorStats;
