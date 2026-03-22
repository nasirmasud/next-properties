// // For internal API calls
// const getApiUrl = () => {
//   // In browser: use relative path
//   if (typeof window !== "undefined") {
//     return ""; // Browser uses relative URLs
//   }
//   // On server: use absolute URL
//   // Try environment variables first, then fallback to localhost
//   const apiUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_DOMAIN;

//   if (apiUrl) {
//     // Remove trailing slash if present
//     return apiUrl.replace(/\/$/, "");
//   }

//   // Fallback to localhost for development
//   console.warn(
//     "⚠️ Using localhost fallback - set NEXTAUTH_URL or NEXT_PUBLIC_API_DOMAIN for production",
//   );
//   return "http://localhost:3000";
// };

// //Fetch all Properties
// async function fetchProperties() {
//   const apiDomain = getApiUrl();
//   try {
//     //Log which domain is being used
//     console.log("📍 Using API Domain:", apiDomain);
//     const url = `${apiDomain}/api/properties`; // Always include /api/
//     console.log("🔄 Fetching properties from:", url);
//     const res = await fetch(url, { cache: "no-store" });
//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error(`❌ API Error ${res.status}:`, errorText);
//       throw new Error(`Failed to fetch data: ${res.status} ${errorText}`);
//     }
//     const data = await res.json();
//     console.log("✅ Properties fetched successfully:", data.length, "items");
//     return data;
//   } catch (error) {
//     console.error("❌ Error in fetchProperties:", {
//       message: error.message,
//       stack: error.stack,
//       apiDomain,
//     });
//     return [];
//   }
// }

// //Fetch single Properties
// async function fetchProperty(id) {
//   const apiDomain = getApiUrl();
//   try {
//     const url = `${apiDomain}/api/properties/${id}`; // Always include /api/
//     console.log("🔄 Fetching property from:", url);
//     const res = await fetch(url);

//     if (!res.ok) {
//       throw new Error("Failed to fetch data");
//     }
//     return await res.json();
//   } catch (error) {
//     console.error("Error fetching property:", {
//       id,
//       apiDomain,
//       message: error.message,
//     });
//     return null;
//   }
// }

// export { fetchProperties, fetchProperty };

// utills/requests.js

// Server Component এর জন্য fetch function - সরাসরি URL ব্যবহার করবে
export async function fetchProperties() {
  // Server Side এ চললে VERCEL_URL ব্যবহার করবে
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXTAUTH_URL || "http://localhost:3000";

  const url = `${baseUrl}/api/properties`;

  try {
    console.log("🔍 Fetching from:", url);
    const res = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("❌ API Response not OK:", res.status);
      return [];
    }

    const data = await res.json();
    console.log("✅ Fetched properties:", data.length);
    return data;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return [];
  }
}

export async function fetchProperty(id) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXTAUTH_URL || "http://localhost:3000";

  const url = `${baseUrl}/api/properties/${id}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("❌ Fetch property error:", error);
    return null;
  }
}
