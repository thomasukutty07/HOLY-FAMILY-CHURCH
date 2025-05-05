import { fetchAllMembers } from "@/Store/User/memberSlice";
import { fetchFamilyByGroupName } from "@/Store/Group/groupSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Users, User, Calendar, HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ShowAllMembers = () => {
  const { members } = useSelector((state) => state.member);
  const { groupNames, loading, familyNames } = useSelector(
    (state) => state.group
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllMembers());
    dispatch(fetchFamilyByGroupName());
  }, [dispatch]);

  const getGroupName = (id) => {
    const group = groupNames.find((group) => group._id === id);
    return group ? group.groupName : "-";
  };

  const getFamilyName = (id) => {
    const family = familyNames.find((family) => family._id === id);
    return family ? family.familyName : "-";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "-";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-gray-600">
            Loading member data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl pb-6">
          <div className="flex items-center gap-3 pt-5">
            <Users className="h-7 w-7 text-indigo-600" />
            <CardTitle className="text-2xl font-bold text-gray-800">
              Member Directory
            </CardTitle>
          </div>
          <p className="text-gray-500 mt-1">
            Complete list of all registered members with their details
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Role
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Name
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Sex
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Baptism Name
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Date of Birth
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Marriage Date
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Family Name
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Group Name
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">
                    Date of Passing
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members && members.length > 0 ? (
                  members.map((member) => (
                    <TableRow
                      key={member._id}
                      className="hover:bg-blue-50 transition-colors duration-150 group border-b border-gray-100"
                    >
                      <TableCell>
                        <Badge
                          variant={
                            member.role === "admin" ? "destructive" : "outline"
                          }
                          className="font-medium capitalize"
                        >
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        {member.name}
                      </TableCell>
                      <TableCell className="capitalize">{member.sex}</TableCell>
                      <TableCell>{member.baptismName || "-"}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {formatDate(member.dateOfBirth)}
                      </TableCell>
                      <TableCell>{formatDate(member.marriageDate)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {getFamilyName(member.familyId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          {getGroupName(member.group)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!member.isActive && member.dateOfDeath ? (
                          <div className="flex items-center gap-1 text-gray-500">
                            <HeartPulse className="h-3 w-3 text-gray-400" />
                            {formatDate(member.dateOfDeath)}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-gray-300" />
                        <p className="text-gray-500 font-medium">
                          No members found
                        </p>
                        <p className="text-gray-400 text-sm">
                          Try adding members to see them listed here
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowAllMembers;
