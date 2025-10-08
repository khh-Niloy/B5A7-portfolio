const getMe = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/get-me`, {
        credentials: "include",
    });
    const data = await res.json();
    return data.data;
  };
  
  export default getMe;
  