import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utills/getSessionUser";

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

// DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
  try {
    const propertyId = params.id;
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }
    const { userId } = sessionUser;
    // Connect to the database
    await connectDB();

    // Find the property by ID
    const property = await Property.findById(propertyId);
    if (!property) return new Response("Property Not Found", { status: 404 });

    //verify the ownership
    if (property.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await property.deleteOne();

    // Return the property data
    return new Response("Property Deleted", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
