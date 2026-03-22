// For internal API calls
const getApiUrl = () => {
  // In browser: use relative path
  if (typeof window !== "undefined") {
    return ""; // Browser uses relative URLs
  }
  // On server: use absolute URL
  // Try environment variables first, then fallback to localhost
  const apiUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_DOMAIN;

  if (apiUrl) {
    // Remove trailing slash if present
    return apiUrl.replace(/\/$/, "");
  }

  // Fallback to localhost for development
  console.warn(
    "⚠️ Using localhost fallback - set NEXTAUTH_URL or NEXT_PUBLIC_API_DOMAIN for production",
  );
  return "http://localhost:3000";
};

//Fetch all Properties
async function fetchProperties() {
  const apiDomain = getApiUrl();
  try {
    //Log which domain is being used
    console.log("📍 Using API Domain:", apiDomain);
    const url = `${apiDomain}/api/properties`; // Always include /api/
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
  const apiDomain = getApiUrl();
  try {
    const url = `${apiDomain}/api/properties/${id}`; // Always include /api/
    console.log("🔄 Fetching property from:", url);
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching property:", {
      id,
      apiDomain,
      message: error.message,
    });
    return null;
  }
}

export { fetchProperties, fetchProperty };
