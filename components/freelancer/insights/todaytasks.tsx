"use client";

import React, { useState } from "react";
import { Square, CheckSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export interface TaskItem {
  id: string;
  title: string;
  progress: string;
  completed?: boolean;
}

export interface TodattaskProps {
  title?: string;
  tasks?: TaskItem[];
  className?: string;
  onViewAll?: () => void;
}

const defaultTasks: TaskItem[] = [
  {
    id: "tt-1",
    title: "Repost 3 Election Posters",
    progress: "0/3",
    completed: false,
  },
  {
    id: "tt-2",
    title: "Repost 2 Breaking News Reels",
    progress: "0/2",
    completed: false,
  },
];

export default function Todaytask({
  title = "Today's Tasks",
  tasks: initialTasks = defaultTasks,
  className = "",
  onViewAll,
}: TodattaskProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div
      className={`w-full max-w-sm bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-base tracking-tight">
          {title}
        </h3>
        <button
          type="button"
          onClick={onViewAll}
            className={`${buttonVariants({variant:'link'})} text-xs `}
        >
          View All
        </button>
      </div>

     
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center justify-between gap-3 p-1 rounded-2xl hover:bg-gray-50/80 transition-colors cursor-pointer group"
          >
           
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                className="text-gray-400 group-hover:text-[#C04808] transition-colors shrink-0"
              >
                {task.completed ? (
                  <CheckSquare className="w-4 h-4 text-[#C04808]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-300" />
                )}
              </button>

              <span
                className={`text-xs sm:text-sm font-semibold truncate transition-all ${task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-700 group-hover:text-gray-900"
                  }`}
              >
                {task.title}
              </span>
            </div>

         
            <span className="text-xs font-semibold text-gray-400 shrink-0">
              {task.progress}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
