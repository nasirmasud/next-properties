const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || "/api";

//Fetch all Properties
async function fetchProperties() {
  try {
    //Log which domain is being used
    console.log("📍 Using API Domain:", apiDomain);
    const url = `${apiDomain}/properties`;
    console.log("🔄 Fetching properties from:", url);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ API Error ${res.status}:`, errorText);
      throw new Error(`Failed to fetch data: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    console.log("✅ Properties fetched successfully:", data.length, "items");
    return data;
  } catch (error) {
    console.error("❌ Error in fetchProperties:", {
      message: error.message,
      stack: error.stack,
      apiDomain,
    });
    return [];
  }
}

//Fetch single Properties
async function fetchProperty(id) {
  try {
    const url = `${apiDomain}/properties/${id}`;
    console.log("🔄 Fetching property from:", url);
    const res = await fetch(url);

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
