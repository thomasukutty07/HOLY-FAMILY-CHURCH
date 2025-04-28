import React from "react";
import { images } from "@/config";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const History = () => {
  return (
    <div className="bg-[#F3F3F1] flex flex-col justify-between px-5 md:px-20 items-center py-10 md:py-20">
      {/* Heading */}
      <div className="flex-1">
        <h1 className="text-4xl md:text-6xl font-compacta text-center">
          Meet Our Leaders
        </h1>
        <p className="max-w-lg mt-4 text-[16px] md:text-[17px] text-center text-gray-700">
          Guided by faith and service, our dedicated leaders inspire and support
          our church community. Meet the people who help shape our spiritual
          journey.
        </p>
      </div>

      {/* Grid of Leaders */}
      <div className="grid grid-cols-4 grid-rows-3 gap-4 mt-8 w-full max-w-5xl h-auto md:h-[700px] p-5">
        <div className="col-span-2 row-span-2 border rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover"
            src={images.marpapa}
            alt="Leader 1"
          />
        </div>
        <div className="col-span-1 border rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover"
            src={images.person2}
            alt="Leader 2"
          />
        </div>
        <div className="col-span-1 border rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover"
            src={images.person4}
            alt="Leader 3"
          />
        </div>
        <div className="col-span-1 border rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover"
            src={images.person2}
            alt="Leader 4"
          />
        </div>
        <div className="col-span-1 border rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover"
            src={images.person4}
            alt="Leader 5"
          />
        </div>
        <div className="col-start-3 col-span-2 row-start-2 row-end-4 border rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover"
            src={images.person3}
            alt="Leader 6"
          />
        </div>
      </div>

      {/* Button */}
      <Button
        variant="outline"
        className="mt-8 py-5 px-6 rounded-lg transition-all duration-300 shadow-md hover:bg-gray-200"
      >
        <Link to="/church/leaders" className="flex items-center gap-2">
          <span className="font-corporates text-[18px] md:text-[22px] cursor-pointer">
            Meet Everyone
          </span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </Button>
    </div>
  );
};

export default History;
