import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ShowAllGroups = () => {
  const { groupLoading, groupNames } = useSelector((state) => state.group);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  useEffect(() => {
    dispatch(fetchAllGroupNames());
  }, [dispatch]);

  // Function to apply face-centered crop using Cloudinary
  const transformCloudinaryUrl = (url) => {
    return url.replace("/upload/", "/upload/w_900,h_600,c_thumb,g_face/");
  };

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
            key={group._id}
            className="group relative overflow-hidden bg-white rounded-xl shadow-md transition-transform transform hover:-translate-y-2 hover:shadow-xl"
          >
            <img
              className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110 rounded-xl"
              src={transformCloudinaryUrl(group.imageUrl)}
              alt={group.groupName}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-100/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-white">
              <h2 className="text-4xl text-center bg-gradient-to-r from-gray-700 via-gray-900 to-black text-transparent bg-clip-text font-extrabold drop-shadow-lg transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {group.groupName}
              </h2>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedGroup(group);
                      setOpen(true);
                      
                    }}
                    className="mt-3 cursor-pointer transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span className="flex items-center gap-2">View Group</span>
                  </Button>
                </DrawerTrigger>

                <DrawerContent open={open} onOpenChange={setOpen}>
                  <DrawerHeader>
                    <DrawerTitle>
                      <h1 className="font-europa">
                        {selectedGroup?.groupName}
                      </h1>
                    </DrawerTitle>
                  </DrawerHeader>

                  <div></div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowAllGroups;
