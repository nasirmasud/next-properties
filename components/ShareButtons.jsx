import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const ShareButtons = ({ property }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;

  return (
    <>
      <h3 className='text-xl font-bold text-center pt-2'>
        Share This Property
      </h3>
      <div className='flex gap-3 justify-center pb-5'>
        <FacebookShareButton
          url={shareUrl}
          quote={property.name}
          hashtag={`#${property.type}ForRent`}
        >
          <FacebookIcon size={40} round={false} borderRadius={20} />{" "}
        </FacebookShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={[property.name]}
          hashtags={`#${property.type}ForRent`}
        >
          <TwitterIcon size={40} round={false} borderRadius={20} />{" "}
        </TwitterShareButton>
        <WhatsappShareButton
          url={shareUrl}
          title={[property.name]}
          separator='::'
        >
          <WhatsappIcon size={40} round={false} borderRadius={20} />{" "}
        </WhatsappShareButton>
        <EmailShareButton
          url={shareUrl}
          quote={[property.name]}
          body={`Check out the property listing: ${shareUrl}`}
        >
          <EmailIcon size={40} round={false} borderRadius={20} />{" "}
        </EmailShareButton>
      </div>
    </>
  );
};

export default ShareButtons;
