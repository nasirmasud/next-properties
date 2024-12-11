"use client";

import BookmarkButton from "@/components/BookmarkButton";
import PropertyContactForm from "@/components/PropertyContactForm";
import PropertyDetails from "@/components/PropertyDetails";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyImages from "@/components/PropertyImages";
import ShareButtons from "@/components/ShareButtons";
import Spinner from "@/components/Spinner";
import { fetchProperty } from "@/utills/requests";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const PropertyPage = () => {
  // Ensure that useParams() is used correctly
  const params = useParams(); // This hook should work with Next.js App Router
  const id = params?.id; // Extract the ID safely

  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;

      try {
        const propertyData = await fetchProperty(id);
        setProperty(propertyData);
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  if (!id) return <p>Invalid Property ID</p>;
  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!property && !loading) {
    return (
      <h1 className='text-center text-2xl font-bold mt-10'>
        Property Not Found
      </h1>
    );
  }

  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && property && (
        <>
          <PropertyHeaderImage image={property.images[0]} />
          <section>
            <div className='container m-auto py-6 px-6'>
              <Link
                href='/properties'
                className='text-blue-500 hover:text-blue-600 flex items-center'
              >
                <FaArrowLeft className='mr-2' />
                Back to Properties
              </Link>
            </div>
          </section>
          <section className='bg-blue-50'>
            <div className='container m-auto py-10 px-6'>
              <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
                <PropertyDetails property={property} />
                <aside className='space-y-4'>
                  <BookmarkButton />
                  <ShareButtons />
                  <PropertyContactForm />
                </aside>
              </div>
            </div>
          </section>
          <PropertyImages images={property.images} />
        </>
      )}
    </>
  );
};

export default PropertyPage;
