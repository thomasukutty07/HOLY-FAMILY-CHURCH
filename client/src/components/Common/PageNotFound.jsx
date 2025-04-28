import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="text-center pt-4">
      <h2 className="font-benzin text-3xl">Page Not Found</h2>
      <Link to="/">Home</Link>
    </div>
  );
};

export default PageNotFound;
