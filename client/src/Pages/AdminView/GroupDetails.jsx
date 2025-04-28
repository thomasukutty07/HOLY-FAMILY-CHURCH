import { fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GroupDetails = () => {
  const { groupLoading, groupNames } = useSelector((state) => state.group);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllGroupNames());
  }, [dispatch]);

  return groupLoading ? (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
    </div>
  ) : (
    <div className="px-4 md:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Groups</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupNames?.map((group) => (
          <div
            key={group.groupName}
            className="group relative overflow-hidden bg-white rounded-xl shadow-md transition-transform transform hover:-translate-y-2 hover:shadow-lg"
          >
            <img
              className="w-full h-64 object-cover"
              src={group.imageUrl}
              alt={group.groupName}
            />

            {/* Overlay with stronger white shade */}
            <div className="absolute inset-0 bg-white bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white">
              <h2 className="text-5xl text-center text-transparent bg-clip-text bg-gradient-to-br from-gray-600 to-gray-800 font-benzin mb-2 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {group.groupName}
              </h2>
              <button className="transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-all duration-500">
                View Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupDetails;
