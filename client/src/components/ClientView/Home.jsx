import React from "react";
import { images } from "../../config/index.js";
import { MapPin } from "lucide-react";

const ClientHome = () => {
  return (
    <div className="bg-[#2b2b2b]">
      <div className="flex flex-col lg:flex-row w-full justify-between items-start lg:pl-20 px-6 py-10 relative">
        {/* Text Section */}
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-lg leading-[1.2] font-compacta text-white">
            Welcome to <br /> Holy Family Church
          </h1>
          <p className="text-gray-300 text-base sm:text-lg lg:text-[20px] mt-5">
            At Holy Family Church, we come together to worship, grow in faith,
            and support one another as a family. Whether you're new or have been
            with us for years, we welcome you with open hearts.
          </p>
          <div className="mt-5 inline-flex items-center gap-2">
            <MapPin color="white" />
            <p className="text-white text-sm sm:text-base lg:text-[18px]">
              Idukki, Kiliyarkandam, 685604
            </p>
          </div>
        </div>

        {/* Soft glowing white circular blur */}
        <div className="hidden lg:block absolute w-[700px] h-[700px] bg-white rounded-full opacity-30 blur-3xl right-[1px] top-10 z-0"></div>

        {/* Image Section */}
        <div className="flex-1 py-10 lg:py-20 relative flex justify-center items-center overflow-hidden w-full lg:max-w-[90%] mx-auto">
          <img
            src={images.holy_family}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[500px] h-auto rounded-3xl object-cover relative z-10"
            alt="Holy Family Church"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
