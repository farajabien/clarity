"use client";
import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useHydratedStore } from "@/hooks/use-hydrated-store";

export function DailyReviewModal() {
  const { todos, setDailyReview, isHydrated } = useHydratedStore();

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!isHydrated) {
    return null;
  }

  // Get today's todos
  const todoList = Object.values(todos).slice(0, 10); // Show first 10 todos

  const handleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    // Handle submit logic here
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Open Daily Review</Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-md w-full">
        <SheetHeader>
          <SheetTitle>Daily Review</SheetTitle>
        </SheetHeader>
        <div className="my-4">
          <Calendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mx-auto"
          />
        </div>
        <div className="space-y-2">
          {todoList.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2">
              <Checkbox
                checked={!!checked[todo.id]}
                onCheckedChange={() => handleCheck(todo.id)}
                id={`todo-${todo.id}`}
              />
              <label htmlFor={`todo-${todo.id}`} className="text-sm">
                {todo.text}
              </label>
            </div>
          ))}
        </div>
        <Button className="mt-6 w-full" onClick={handleSubmit}>
          Complete Review
        </Button>
      </SheetContent>
    </Sheet>
  );
}

export default DailyReviewModal;
