import Image from "next/image";

const PropertyHeaderImage = ({ image }) => {
  const getImageSrc = (img) => {
    return img.startsWith("http") ? img : `/images/properties/${img}`;
  };

  return (
    <>
      <section>
        <div className='container-xl m-auto'>
          <div className='grid grid-cols-1'>
            <Image
              src={getImageSrc(image)}
              alt=''
              className='object-cover h-[400px] w-full'
              sizes='100vw'
              height={0}
              width={0}
              priority={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default PropertyHeaderImage;
