"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
} from "lucide-react";

import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { CalendarSkeleton } from "@/components/ui/Skeletonloading";

interface ScheduledItem {
  id: string;
  platform: 'youtube' | 'twitter' | 'instagram' | 'linkedin';
  type: string;
  title: string;
  time: string;
  status: 'Published' | 'Scheduled' | 'Draft';
}
interface DayEvent {
  type: 'progress' | 'dots' | 'bottom-bar' | 'small-offset';
  progress?: number;
  dots?: ('orange' | 'grey')[];
  items?: ScheduledItem[];
}

const getMockEvents = (): Record<string, DayEvent> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  
  return {
    [`${year}-${month}-01`]: {
      type: 'dots',
      dots: ['orange'],
      items: [
        { id: '1', platform: 'youtube', type: 'Video', title: 'Ultimate Next.js 16 Admin Dashboard Guide', time: '10:00 AM', status: 'Published' },
      ]
    },
    [`${year}-${month}-05`]: {
      type: 'dots',
      dots: ['orange', 'grey', 'grey'],
      items: [
        { id: '4', platform: 'youtube', type: 'Short', title: 'How to use Gemini API in under 60 seconds 🚀', time: '11:00 AM', status: 'Scheduled' },
      ]
    },
    [`${year}-${month}-08`]: {
      type: 'bottom-bar',
      items: [
        { id: '7', platform: 'youtube', type: 'Video', title: 'AMA: Building AI Products live in public', time: '04:00 PM', status: 'Scheduled' },
      ]
    },
    [`${year}-${month}-12`]: {
      type: 'dots',
      dots: ['orange', 'orange', 'grey'],
      items: [
        { id: '10', platform: 'instagram', type: 'Reel', title: 'AI Automation workflow tutorial', time: '11:30 AM', status: 'Scheduled' },
      ]
    },
    [`${year}-${month}-15`]: {
      type: 'dots',
      dots: ['orange'],
      items: [
        { id: '12', platform: 'linkedin', type: 'Post', title: 'The Future of AI Agents in Developer Ecosystems', time: '09:00 AM', status: 'Scheduled' }
      ]
    }
  };
};

const defaultEvents = getMockEvents();

interface CalendarProps {
  isLoading?: boolean;
}

export default function Calendar({ isLoading: propIsLoading }: CalendarProps = {}) {
  const [isLoading, setIsLoading] = useState(propIsLoading ?? true);
  UsetimeoutLoader(setIsLoading);

  const [currentDate, setCurrentDate] = useState<Date>(new Date()); 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events] = useState<Record<string, DayEvent>>(defaultEvents);

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      if (month === 0) {
        return new Date(year - 1, 11, 1);
      } else {
        return new Date(year, month - 1, 1);
      }
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      if (month === 11) {
        return new Date(year + 1, 0, 1);
      } else {
        return new Date(year, month + 1, 1);
      }
    });
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
      isCurrentMonth: false
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }

  const totalCells = calendarDays.length <= 35 ? 35 : 42;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextMonthDay = 1;
  while (calendarDays.length < totalCells) {
    calendarDays.push({
      date: new Date(nextYear, nextMonth, nextMonthDay++),
      isCurrentMonth: false
    });
  }

  const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-3 min-[360px]:p-4 sm:p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#FFEFE0]">
        {/* Month Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-6">
          <div className="flex flex-col">
            <h2 className="text-lg min-[360px]:text-xl sm:text-2xl font-extrabold text-gray-900 leading-none">
              {months[month]} {year}
            </h2>
            <span className="text-[9px] min-[360px]:text-[10px] sm:text-xs font-bold tracking-widest text-[#F27D42] mt-1 uppercase opacity-80">
              TIMELINE OVERVIEW
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button 
              onClick={handlePrevMonth}
              className="p-1 sm:p-2 border border-gray-100 rounded-full hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={handleToday}
              className="px-3 sm:px-5 py-1 sm:py-1.5 border border-gray-200 hover:border-[#F27D42] hover:bg-[#FFF2EC] text-gray-700 hover:text-[#F27D42] rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer"
            >
              Today
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-1 sm:p-2 border border-gray-100 rounded-full hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-7 border-b border-gray-100 pb-2 sm:pb-6 mb-2 sm:mb-6">
          {weekdays.map((day) => (
            <div 
              key={day} 
              className="text-center text-[8px] min-[360px]:text-[10px] sm:text-xs md:text-sm font-extrabold text-[#F27D42] tracking-wider py-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 min-[360px]:gap-1.5 sm:gap-3 md:gap-2">
          {calendarDays.map((cell) => {
            const dateKey = formatDateKey(cell.date);
            const isSelected = formatDateKey(selectedDate) === dateKey;
            const eventInfo = events[dateKey];
            
            const hasDots = eventInfo?.type === 'dots' && eventInfo?.dots;
            const hasThickBottomBar = eventInfo?.type === 'bottom-bar';

            let cellClass = "h-11 min-[360px]:h-12 sm:h-14 md:h-16 lg:h-20 flex flex-col justify-between items-center py-1 px-0.5 sm:p-3 rounded-[16px] min-[360px]:rounded-[20px] sm:rounded-2xl md:rounded-[20px] transition-all duration-200 border relative cursor-pointer select-none ";
            
            if (!cell.isCurrentMonth) {
              cellClass += "border-transparent bg-transparent text-gray-300 pointer-events-none disabled:opacity-40 ";
            } else if (isSelected) {
              cellClass += "border-2 border-[#F27D42] ring-2 min-[360px]:ring-4 ring-[#F27D42]/15 bg-white shadow-xs ";
            } else {
              cellClass += "border-[#FFEFE0] bg-white hover:border-[#F27D42]/40 hover:shadow-xs ";
            }

            return (
              <button 
                type="button"
                key={dateKey}
                disabled={!cell.isCurrentMonth}
                className={cellClass}
                onClick={() => {
                  if (cell.isCurrentMonth) {
                    setSelectedDate(cell.date);
                  }
                }}
              >
                {/* Day Number */}
                <span className={`
                  mt-0.5 sm:mt-0 text-center transition-transform
                  ${!cell.isCurrentMonth ? 'text-gray-300' : ''}
                  ${isSelected ? 'text-[#F27D42] font-black text-xs min-[360px]:text-sm sm:text-xl md:text-2xl scale-105' : 'text-gray-900 font-bold text-[11px] min-[360px]:text-xs sm:text-base'}
                `}>
                  {cell.date.getDate()}
                </span>

                {/* Event Indicators */}
                <div className="w-full flex flex-col items-center mt-auto pb-1 min-w-0">
                  {cell.isCurrentMonth && hasThickBottomBar && (
                    <div className="w-3.5 sm:w-6 h-1 bg-[#F27D42] rounded-full" />
                  )}

                  {cell.isCurrentMonth && hasDots && (
                    <div className="flex gap-0.5 justify-center items-center">
                      {eventInfo.dots?.map((color, dIdx) => (
                        <span 
                          key={`${color}-${dIdx}`}
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                            color === 'orange' ? 'bg-[#F27D42]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}