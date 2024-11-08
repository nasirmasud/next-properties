import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "NextProperties | Find the Perfect Property for You",
  description: "Find Your Dream Rental Property",
  keywords:
    "rental, buy, sell, rent, find property, buy property, sell property, rent office",
};

const MainLayout = ({ children }) => {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
};

export default MainLayout;
