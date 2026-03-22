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

// সার্ভার সাইড এবং ক্লায়েন্ট সাইডের জন্য আলাদাভাবে URL বের করার ফাংশন
const getBaseUrl = () => {
  // ক্লায়েন্ট সাইড (ব্রাউজার): রিলেটিভ পাথ ব্যবহার করবে
  if (typeof window !== "undefined") {
    return "";
  }

  // সার্ভার সাইড (Node.js): ভারসেলের প্রোডাকশন URL ব্যবহার করবে
  // ভারসেল স্বয়ংক্রিয়ভাবে এই ভেরিয়েবল সেট করে
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // লোকাল ডেভেলপমেন্টের জন্য ফallback
  return "http://localhost:3000";
};

// সব প্রোপার্টি আনার ফাংশন
export async function fetchProperties() {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/properties`;

  try {
    console.log("Fetching properties from:", url); // ডিবাগিং এর জন্য

    const res = await fetch(url, {
      cache: "no-store", // সর্বদা নতুন ডাটা আনার জন্য
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const properties = await res.json();
    console.log("Properties fetched:", properties.length); // ডিবাগিং এর জন্য
    return properties;
  } catch (error) {
    console.error("Error in fetchProperties:", error);
    return []; // error হলে খালি array রিটার্ন করবে, যাতে পেজ crash না করে
  }
}

// একক প্রোপার্টি আনার ফাংশন
export async function fetchProperty(id) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/properties/${id}`;

  try {
    console.log("Fetching property from:", url);

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const property = await res.json();
    return property;
  } catch (error) {
    console.error(`Error in fetchProperty for id ${id}:`, error);
    return null;
  }
}
