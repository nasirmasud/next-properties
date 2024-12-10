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

// PUT /api/properties/:id
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { id } = params;
    const { userId } = sessionUser;
    const formData = await request.formData();

    //access all values from amenities
    const amenities = formData.getAll("amenities");

    //Get property to update
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return new Response("Property does not exist", { status: 404 });
    }
    //Verify ownership
    if (existingProperty.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    //Create propertydata object for database
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    // Update property & database
    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);
    return new Response(JSON.stringify(updatedProperty), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);

    return new Response("Failed to add property", { status: 500 });
  }
};
