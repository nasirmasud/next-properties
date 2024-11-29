import connectDB from "@/config/database";
import Property from "@/models/Property";

// GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    // Connect to the database
    await connectDB();

    // Await the params object to access `id`
    const { id } = await params;
    if (!id) return new Response("Invalid Property ID", { status: 400 });

    // Find the property by ID
    const property = await Property.findById(id);
    if (!property) return new Response("Property Not Found", { status: 404 });

    // Return the property data
    return new Response(JSON.stringify(property), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
