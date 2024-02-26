"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-red-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-red-400",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-red-100/50 [&:has([aria-selected])]:bg-red-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-red-800/50 dark:[&:has([aria-selected])]:bg-red-800",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-red-900 text-red-50 hover:bg-red-900 hover:text-red-50 focus:bg-red-900 focus:text-red-50 dark:bg-red-50 dark:text-red-900 dark:hover:bg-red-50 dark:hover:text-red-900 dark:focus:bg-red-50 dark:focus:text-red-900",
        day_today: "bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-50",
        day_outside:
          "day-outside text-red-500 opacity-50 aria-selected:bg-red-100/50 aria-selected:text-red-500 aria-selected:opacity-30 dark:text-red-400 dark:aria-selected:bg-red-800/50 dark:aria-selected:text-red-400",
        day_disabled: "text-red-500 opacity-50 dark:text-red-400",
        day_range_middle:
          "aria-selected:bg-red-100 aria-selected:text-red-900 dark:aria-selected:bg-red-800 dark:aria-selected:text-red-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
