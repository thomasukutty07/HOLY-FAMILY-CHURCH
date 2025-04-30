import { fetchAllUsers } from "@/Store/User/userSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllFamilyNames } from "@/Store/Family/familySlice";
import { fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { Loader2 } from "lucide-react";
const ShowAllMembers = () => {
  const { users } = useSelector((state) => state.user);
  const { familyNames, familyLoading } = useSelector((state) => state.family);
  const { groupNames, groupLoading } = useSelector((state) => state.group);
  const dispatch = useDispatch();

  function fetchUser() {
    dispatch(fetchAllUsers()).then((data) => {
      console.log(data);
    });
  }
  function fetchAllFamily() {
    dispatch(fetchAllFamilyNames()).then((data) => {
      console.log(data);
    });
  }
  function fetchAllGroup() {
    dispatch(fetchAllGroupNames()).then((data) => {
      console.log(data);
    });
  }
  function getGroupName(id) {
    const group = groupNames.find((eachGroup) => eachGroup._id === id);
    return group ? group.groupName : "-";
  }
  function getFamilyName(id) {
    const fam = familyNames.find((fam) => fam._id === id);
    return fam ? fam.familyName : "-";
  }
  useEffect(() => {
    fetchUser();
    fetchAllFamily();
    fetchAllGroup();
  }, [dispatch]);

  return familyLoading || groupLoading ? (
    <div className="flex items-center h-full justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
  ) : (
    <div>
      <Table>
        <TableCaption className="caption-top mb-5 mt-0 text-4xl font-europa text-black">
          All Members
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[15px] font-corporates">Name</TableHead>
            <TableHead className="text-[15px] font-corporates">Sex</TableHead>
            <TableHead className="text-[15px] font-corporates">
              Baptism Name
            </TableHead>
            <TableHead className="text-[15px] font-corporates">
              Date of Birth
            </TableHead>
            <TableHead className="text-[15px] font-corporates">
              Marriage Date
            </TableHead>
            <TableHead className="text-[15px] font-corporates">
              Family Name
            </TableHead>
            <TableHead className="text-[15px] font-corporates">
              Group Name
            </TableHead>
            <TableHead className="text-[15px] font-corporates">
              Date of Passing
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0
            ? users.map((eachUsers) => (
                <TableRow className="font-medium" key={eachUsers._id}>
                  <TableCell className="font-medium">
                    {eachUsers.name}
                  </TableCell>
                  <TableCell>
                    {eachUsers.sex.charAt(0).toUpperCase() +
                      eachUsers.sex.slice(1)}
                  </TableCell>
                  <TableCell>{eachUsers.baptismName}</TableCell>
                  <TableCell>
                    {eachUsers.dateOfBirth
                      ? new Date(eachUsers.dateOfBirth).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {eachUsers.married && eachUsers.marriageDate
                      ? new Date(eachUsers.marriageDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{getFamilyName(eachUsers.familyId)}</TableCell>
                  <TableCell>{getGroupName(eachUsers.groupId)}</TableCell>
                  <TableCell>
                    {!eachUsers.isActive && eachUsers.dateOfDeath
                      ? new Date(eachUsers.dateOfDeath).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShowAllMembers;
