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

// Dummy data for todos (replace with real data as needed)
const todos = [
  { id: "1", text: "Review project goals" },
  { id: "2", text: "Plan today's top 3 tasks" },
  { id: "3", text: "Check client emails" },
];

export function DailyReviewModal() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});

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
          {todos.map((todo) => (
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
