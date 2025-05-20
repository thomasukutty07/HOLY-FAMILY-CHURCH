import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CustomDatePicker = ({ value, onChange, name }) => {
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(selectedDate ? selectedDate.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (e, day) => {
    e.preventDefault();
    e.stopPropagation();
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    onChange(newDate.toISOString().split('T')[0]);
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(parseInt(month));
  };

  const handleYearChange = (year) => {
    setCurrentYear(parseInt(year));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-7"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth && 
        selectedDate.getFullYear() === currentYear;

      days.push(
        <button
          key={day}
          type="button"
          onClick={(e) => handleDateSelect(e, day)}
          className={`h-7 w-7 rounded-full flex items-center justify-center text-sm
            ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}
            ${selectedDate && selectedDate.getDate() === day ? 'font-medium' : ''}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Generate years array (100 years back from current year)
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year;
  });

  return (
    <div className="">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={selectedDate ? format(selectedDate, "PPP") : ""}
            readOnly
            className="w-full pl-10 pr-2 py-2 text-base bg-white border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-30 rounded-md cursor-pointer"
          />
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Select
            value={currentMonth.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[110px] h-8 text-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-sm">
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()} className="text-sm hover:bg-gray-100">
                  {format(new Date(2000, i), "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[90px] h-8 text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-sm">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()} className="text-sm hover:bg-gray-100">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker; 