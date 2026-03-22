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

// utilities/requests.js

// Helper function to get the correct API URL
const getApiUrl = () => {
  // On the client (browser), use relative URLs
  if (typeof window !== "undefined") {
    return "";
  }

  // On the server (SSR/SSG), use absolute URL
  // Vercel automatically provides these environment variables
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // For preview deployments
  if (process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }

  // Use custom environment variable if set
  const apiUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_DOMAIN;
  if (apiUrl) {
    return apiUrl.replace(/\/$/, "");
  }

  // Fallback for local development
  return "http://localhost:3000";
};

// Fetch all properties
export async function fetchProperties() {
  const apiDomain = getApiUrl();

  try {
    const url = `${apiDomain}/api/properties`;
    console.log("📍 Fetching properties from:", url);

    const res = await fetch(url, {
      cache: "no-store",
      // Add timeout to prevent hanging in production
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ API Error ${res.status}:`, errorText);
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Properties fetched:", data.length, "items");
    return data;
  } catch (error) {
    console.error("❌ Error fetching properties:", error.message);
    return [];
  }
}

// Fetch single property by ID
export async function fetchProperty(id) {
  if (!id) {
    console.error("❌ No property ID provided");
    return null;
  }

  const apiDomain = getApiUrl();

  try {
    const url = `${apiDomain}/api/properties/${id}`;
    console.log("📍 Fetching property from:", url);

    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error(
        `❌ API Error ${res.status}: Failed to fetch property ${id}`,
      );
      return null;
    }

    const data = await res.json();
    console.log("✅ Property fetched:", data?.name || "Unknown");
    return data;
  } catch (error) {
    console.error("❌ Error fetching property:", error.message);
    return null;
  }
}
