const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

//Fetch all Properties
async function fetchProperties() {
  try {
    //Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/properties`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

//Fetch single Properties
async function fetchProperty(id) {
  //Handle the case where the domain is not available yet
  try {
    if (!apiDomain) {
      return null;
    }
    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

export { fetchProperties, fetchProperty };
