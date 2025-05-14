import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Filter } from "lucide-react";
import { Button } from "../ui/button";

const MemberFilter = ({
  filterBy,
  setFilterBy,
  activeFamily,
  activeGroup,
  setActiveFamily,
  setActiveGroup,
  familyNames,
  groupNames,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-gray-200">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-gray-500 mt-1">
          Status
        </DropdownMenuLabel>
        <DropdownMenuItem
          className={filterBy === "all" ? "bg-blue-50 text-blue-600" : ""}
          onClick={() => setFilterBy("all")}
        >
          All Members
        </DropdownMenuItem>
        <DropdownMenuItem
          className={filterBy === "active" ? "bg-blue-50 text-blue-600" : ""}
          onClick={() => setFilterBy("active")}
        >
          Active Members
        </DropdownMenuItem>
        <DropdownMenuItem
          className={filterBy === "inactive" ? "bg-blue-50 text-blue-600" : ""}
          onClick={() => setFilterBy("inactive")}
        >
          Inactive Members
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-gray-500">
          Family
        </DropdownMenuLabel>
        <DropdownMenuItem
          className={activeFamily === "all" ? "bg-blue-50 text-blue-600" : ""}
          onClick={() => setActiveFamily("all")}
        >
          All Families
        </DropdownMenuItem>
        {familyNames.map((family) => (
          <DropdownMenuItem
            key={family._id}
            className={
              activeFamily === family._id ? "bg-blue-50 text-blue-600" : ""
            }
            onClick={() => setActiveFamily(family._id)}
          >
            {family.familyName}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-gray-500">
          Group
        </DropdownMenuLabel>
        <DropdownMenuItem
          className={activeGroup === "all" ? "bg-blue-50 text-blue-600" : ""}
          onClick={() => setActiveGroup("all")}
        >
          All Groups
        </DropdownMenuItem>
        {groupNames.map((group) => (
          <DropdownMenuItem
            key={group._id}
            className={
              activeGroup === group._id ? "bg-blue-50 text-blue-600" : ""
            }
            onClick={() => setActiveGroup(group._id)}
          >
            {group.groupName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberFilter;
