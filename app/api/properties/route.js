import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utills/getSessionUser";

//GET /api/properties
export const GET = async (request) => {
  try {
    console.log("🔄 GET /api/properties - Connecting to DB...");
    await connectDB();
    console.log("✅ DB Connected - Fetching properties...");
    const properties = await Property.find({});
    console.log(`✅ Found ${properties.length} properties`);

    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ GET /api/properties error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({ error: error.message, type: error.name }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    const formData = await request.formData();
    //access all values from amenities and images
    const amenities = formData.getAll("amenities");
    const images = formData
      .getAll("images")
      .filter((images) => images.name !== "");

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

    //Upload images to Cloudinary
    const imagesUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);
      //convert the image data tobase64
      const imageBase64 = imageData.toString("base64");
      //Make request to upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        { folder: "nextproperties" },
      );
      imagesUploadPromises.push(result.secure_url);

      //wait for all images to upload
      const uploadedImages = await Promise.all(imagesUploadPromises);
      //add upload images to the propertyData object
      propertyData.images = uploadedImages;
    }

    // Save data to database
    const newProperty = new Property(propertyData);
    await newProperty.save();

    //redirect to property page after submit to database
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`,
    );

    // return new Response(JSON.stringify({ message: "Success" }), {
    //   status: 200,
    // });
  } catch (error) {
    console.error("Error in POST handler:", error);

    return new Response("Failed to add property", { status: 500 });
  }
};
