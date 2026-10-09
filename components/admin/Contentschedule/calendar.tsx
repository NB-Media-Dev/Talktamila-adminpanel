"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarSkeleton } from "@/components/ui/Skeletonloading";
import { onPostsChanged } from "@/services/post.service";
import type { Post } from "@/types/Posts";
import { dayKey, endOfDay, errorMessage, fetchAllScheduled, isSameDay, startOfDay } from "@/lib/schedule";

interface CalendarProps {
  /** The day the Queue is filtered to, or null for "all upcoming". */
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [events, setEvents] = useState<Record<string, Post[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // The 5 or 6 weeks shown for this month, including grey days from the neighbouring months.
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const jsDay = new Date(year, month, 1).getDay();
    const startDay = jsDay === 0 ? 6 : jsDay - 1; // week starts on Monday
    const cells: { date: Date; isCurrentMonth: boolean }[] = [];
    for (let i = startDay; i > 0; i--) cells.push({ date: new Date(year, month, 1 - i), isCurrentMonth: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
    const total = cells.length <= 35 ? 35 : 42;
    for (let d = 1; cells.length < total; d++) cells.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    return cells;
  }, [year, month]);

  const rangeStartMs = calendarDays[0].date.getTime();
  const rangeEndMs = endOfDay(calendarDays[calendarDays.length - 1].date).getTime();

  const load = useCallback(async () => {
    try {
      const items = await fetchAllScheduled(new Date(rangeStartMs), new Date(rangeEndMs));
      const grouped: Record<string, Post[]> = {};
      for (const post of items) {
        if (!post.scheduled_at) continue;
        const key = dayKey(new Date(post.scheduled_at));
        (grouped[key] ??= []).push(post);
      }
      setEvents(grouped);
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }, [rangeStartMs, rangeEndMs]);

  useEffect(() => {
    load();
    return onPostsChanged(() => {
      load();
    });
  }, [load]);

  if (isLoading) return <CalendarSkeleton />;

  const today = startOfDay(new Date());
  const viewingCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-3 min-[360px]:p-4 sm:p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#FFEFE0]">
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-6">
          <div className="flex flex-col">
            <h2 className="text-lg min-[360px]:text-xl sm:text-2xl font-extrabold text-gray-900 leading-none">
              {MONTHS[month]} {year}
            </h2>
            <span className="text-[9px] min-[360px]:text-[10px] sm:text-xs font-bold tracking-widest text-[#F27D42] mt-1 uppercase opacity-80">
              TIMELINE OVERVIEW
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              disabled={viewingCurrentMonth}
              className="p-1 sm:p-2 border border-gray-100 rounded-full hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title={viewingCurrentMonth ? "Past months can't be scheduled" : "Previous Month"}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 sm:px-5 py-1 sm:py-1.5 border border-gray-200 hover:border-[#F27D42] hover:bg-[#FFF2EC] text-gray-700 hover:text-[#F27D42] rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-1 sm:p-2 border border-gray-100 rounded-full hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-3 text-xs font-semibold text-red-600">
            Could not load scheduled posts: {error}
          </p>
        )}

        <div className="grid grid-cols-7 border-b border-gray-100 pb-2 sm:pb-6 mb-2 sm:mb-6">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-[8px] min-[360px]:text-[10px] sm:text-xs md:text-sm font-extrabold text-[#F27D42] tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 min-[360px]:gap-1.5 sm:gap-3 md:gap-2">
          {calendarDays.map((cell) => {
            const key = dayKey(cell.date);
            const count = events[key]?.length ?? 0;
            const isPast = cell.date < today;
            const isToday = isSameDay(cell.date, today);
            const isSelected = selectedDate !== null && isSameDay(cell.date, selectedDate);
            const disabled = !cell.isCurrentMonth || isPast;

            let cellClass =
              "h-11 min-[360px]:h-12 sm:h-14 md:h-16 lg:h-20 flex flex-col justify-between items-center py-1 px-0.5 sm:p-3 rounded-[16px] min-[360px]:rounded-[20px] sm:rounded-2xl md:rounded-[20px] transition-all duration-200 border relative select-none ";
            if (!cell.isCurrentMonth) {
              cellClass += "border-transparent bg-transparent text-gray-300 pointer-events-none ";
            } else if (isPast) {
              cellClass += "border-transparent bg-gray-50 text-gray-300 cursor-not-allowed ";
            } else if (isSelected) {
              cellClass += "border-2 border-[#F27D42] ring-2 min-[360px]:ring-4 ring-[#F27D42]/15 bg-white shadow-xs cursor-pointer ";
            } else if (isToday) {
              cellClass += "border-[#F27D42]/60 bg-white hover:border-[#F27D42] cursor-pointer ";
            } else {
              cellClass += "border-[#FFEFE0] bg-white hover:border-[#F27D42]/40 hover:shadow-xs cursor-pointer ";
            }

            return (
              <button
                type="button"
                key={key}
                disabled={disabled}
                title={isPast && cell.isCurrentMonth ? "This day has passed" : undefined}
                className={cellClass}
                onClick={() => onSelectDate(isSelected ? null : cell.date)}
              >
                <span
                  className={`mt-0.5 sm:mt-0 text-center transition-transform ${
                    !cell.isCurrentMonth || isPast
                      ? "text-gray-300 font-bold text-[11px] min-[360px]:text-xs sm:text-base"
                      : isSelected
                        ? "text-[#F27D42] font-black text-xs min-[360px]:text-sm sm:text-xl md:text-2xl scale-105"
                        : "text-gray-900 font-bold text-[11px] min-[360px]:text-xs sm:text-base"
                  }`}
                >
                  {cell.date.getDate()}
                </span>

                <div className="w-full flex flex-col items-center mt-auto pb-1 min-w-0">
                  {cell.isCurrentMonth && count > 3 && (
                    <div className="w-3.5 sm:w-6 h-1 bg-[#F27D42] rounded-full" title={`${count} posts`} />
                  )}
                  {cell.isCurrentMonth && count > 0 && count <= 3 && (
                    <div className="flex gap-0.5 justify-center items-center" title={`${count} post${count > 1 ? "s" : ""}`}>
                      {Array.from({ length: count }, (_, i) => (
                        <span key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#F27D42]" />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-[10px] sm:text-xs text-gray-400 font-medium">
          Orange marks are posts waiting to go live. Days that have passed can&apos;t be scheduled.
        </p>
      </div>
    </div>
  );
}