import background from "@/assets/images/dhaka.jpg";
import Image from "next/image";
import PropertySearchForm from "./PropertySearchForm";

const Hero = () => {
  return (
    <section className='relative py-20 mb-4'>
      <Image
        src={background}
        alt='background'
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        className='z-0'
      />
      {/* Content Overlay */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold text-white sm:text-5xl md:text-6xl'>
            Find The Perfect Rental
          </h1>
          <p className='my-4 text-xl text-white'>
            Discover the perfect property that suits your needs.
          </p>
        </div>
        <PropertySearchForm />
      </div>
      {/* Overlay */}
      <div className='absolute inset-0 bg-black opacity-50 z-5'></div>
    </section>
  );
};

export default Hero;
