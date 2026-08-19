"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
} from "lucide-react";

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
      type: 'progress',
      progress: 65,
      items: [
        { id: '1', platform: 'youtube', type: 'Video', title: 'Ultimate Next.js 16 Admin Dashboard Guide', time: '10:00 AM', status: 'Published' },
        { id: '2', platform: 'instagram', type: 'Reel', title: 'Day in the life of a Solopreneur AI dev', time: '02:30 PM', status: 'Published' },
        { id: '3', platform: 'twitter', type: 'Thread', title: 'Why Next.js is a game changer for startups', time: '06:00 PM', status: 'Draft' }
      ]
    },
    [`${year}-${month}-05`]: {
      type: 'dots',
      dots: ['orange', 'grey', 'grey'],
      items: [
        { id: '4', platform: 'youtube', type: 'Short', title: 'How to use Gemini API in under 60 seconds 🚀', time: '11:00 AM', status: 'Scheduled' },
        { id: '5', platform: 'linkedin', type: 'Post', title: 'Reflecting on my first 10,000 users. Here is what I learned.', time: '01:00 PM', status: 'Draft' },
        { id: '6', platform: 'twitter', type: 'Tweet', title: 'Ship fast, break things, iterate. 🛠️', time: '05:00 PM', status: 'Draft' }
      ]
    },
    [`${year}-${month}-08`]: {
      type: 'bottom-bar',
      items: [
        { id: '7', platform: 'youtube', type: 'Video', title: 'AMA: Building AI Products live in public', time: '04:00 PM', status: 'Scheduled' },
        { id: '8', platform: 'instagram', type: 'Reel', title: 'Aadi Perukku Special Creator Guide', time: '09:00 AM', status: 'Published' }
      ]
    },
    [`${year}-${month}-10`]: {
      type: 'small-offset',
      items: [
        { id: '9', platform: 'twitter', type: 'Tweet', title: 'Happy Weekend! What are you building today?', time: '10:00 AM', status: 'Scheduled' }
      ]
    },
    [`${year}-${month}-12`]: {
      type: 'dots',
      dots: ['orange', 'orange', 'grey'],
      items: [
        { id: '10', platform: 'instagram', type: 'Reel', title: 'AI Automation workflow tutorial', time: '11:30 AM', status: 'Scheduled' },
        { id: '11', platform: 'youtube', type: 'Video', title: 'Building a SaaS in 24 hours with AI tools', time: '03:00 PM', status: 'Scheduled' }
      ]
    },
    [`${year}-${month}-15`]: {
      type: 'progress',
      progress: 30,
      items: [
        { id: '12', platform: 'linkedin', type: 'Post', title: 'The Future of AI Agents in Developer Ecosystems', time: '09:00 AM', status: 'Scheduled' }
      ]
    }
  };
};

const defaultEvents = getMockEvents();

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Record<string, DayEvent>>(defaultEvents);

  const [newTitle, setNewTitle] = useState("");

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
        return new Date(year -  1, 11, 1);
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
      <div className="w-full bg-white rounded-[32px] p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#FFEFE0]">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-gray-900 leading-none">
              {months[month]} {year}
            </h2>
            <span className="text-xs font-bold tracking-widest text-[#F27D42] mt-1.5 uppercase opacity-80">
              TIMELINE OVERVIEW
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrevMonth}
              className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleToday}
              className="px-5 py-1.5 border border-gray-200 hover:border-[#F27D42] hover:bg-[#FFF2EC] text-gray-700 hover:text-[#F27D42] rounded-full text-sm font-bold transition-all duration-200"
            >
              Today
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-100 pb-10 mb-7">
          {weekdays.map((day, idx) => (
            <div 
              key={idx} 
              className="text-center text-[10px] xs:text-xs sm:text-sm font-extrabold text-[#F27D42] tracking-wider py-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 md:gap-2">
          {calendarDays.map((cell, idx) => {
            const dateKey = formatDateKey(cell.date);
            const isSelected = formatDateKey(selectedDate) === dateKey;
            const eventInfo = events[dateKey];
            
            const hasProgressBar = eventInfo?.type === 'progress';
            const hasDots = eventInfo?.type === 'dots' && eventInfo?.dots;
            const hasThickBottomBar = eventInfo?.type === 'bottom-bar';
            const isSmallOffset = eventInfo?.type === 'small-offset';

            let cellClass = "aspect-square sm:aspect-auto sm:h-20  md:h-20 flex flex-col justify-between p-1.5 xs:p-2 sm:p-3 rounded-xl sm:rounded-2xl md:rounded-[20px] transition-all duration-200 border relative cursor-pointer ";
            
            if (!cell.isCurrentMonth) {
              cellClass += "border-transparent bg-transparent text-gray-300 pointer-events-none ";
            } else if (isSelected) {
              cellClass += "border-2 border-[#F27D42] ring-4 ring-[#F27D42]/10 bg-white shadow-sm ";
            } else if (hasThickBottomBar) {
              cellClass += "border-[#FFEFE0] border-b-4 border-b-[#F27D42] bg-white hover:border-[#F27D42]/40 hover:shadow-sm ";
            } else {
              cellClass += "border-[#FFEFE0] bg-white hover:border-[#F27D42]/40 hover:shadow-sm ";
            }

            return (
              <div 
                key={idx}
                className={cellClass}
                onClick={() => {
                  if (cell.isCurrentMonth) {
                    setSelectedDate(cell.date);
                  }
                }}
              >
             
                <div className="w-full flex justify-between items-start">
                  <span className={`
                    ${!cell.isCurrentMonth ? 'text-gray-300' : ''}
                    ${isSelected ? 'text-[#F27D42] font-extrabold text-sm xs:text-base sm:text-xl md:text-2xl' : 'text-gray-900 font-semibold text-xs xs:text-sm sm:text-base'}
                    ${hasThickBottomBar ? 'font-black text-xs xs:text-sm sm:text-lg md:text-xl text-gray-900' : ''}
                    ${isSmallOffset ? 'text-[9px] xs:text-[10px] sm:text-xs text-gray-400 font-medium' : ''}
                  `}>
                    {cell.date.getDate()}
                  </span>
                  
                  {cell.isCurrentMonth && !isSelected && (
                    <span className="opacity-0 hover:opacity-100 transition-opacity absolute top-2 right-2 p-1 text-[#F27D42]">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="w-full flex flex-col items-center mt-auto pb-0.5">
                  
                  {cell.isCurrentMonth && hasProgressBar && eventInfo.progress && (
                    <div className="w-full px-0.5 sm:px-1 mt-0.5 xs:mt-1">
                      <div className="h-1 w-full bg-[#FFF2EC] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#F27D42] rounded-full" 
                          style={{ width: `${eventInfo.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {cell.isCurrentMonth && hasDots && (
                    <div className="flex gap-0.5 xs:gap-1 justify-center items-center mt-0.5 xs:mt-1.5">
                      {eventInfo.dots?.map((color, dIdx) => (
                        <span 
                          key={dIdx}
                          className={`w-1 h-1 xs:w-1.5 xs:h-1.5 rounded-full ${
                            color === 'orange' ? 'bg-[#F27D42]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}