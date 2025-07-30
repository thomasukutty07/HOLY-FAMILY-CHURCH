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

const GroupFilter = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  const sortOptions = [
    { label: "Name (A to Z)", value: "name_asc" },
    { label: "Name (Z to A)", value: "name_desc" },
    { label: "Recently Added", value: "date_desc" },
    { label: "Oldest First", value: "date_asc" },
    { label: "Most Families", value: "families_desc" },
    { label: "Least Families", value: "families_asc" },
  ];

  const handleSort = (value) => {
    setSortBy(value);
    setSortOrder(value.includes("desc") ? "desc" : "asc");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-gray-200">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          Sort by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={sortBy === option.value ? "bg-indigo-50 text-indigo-600" : ""}
            onClick={() => handleSort(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupFilter; 