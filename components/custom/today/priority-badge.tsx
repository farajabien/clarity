import { Badge } from "@/components/ui/badge";

const priorityColors: Record<string, string> = {
  urgent: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-400 text-black",
  low: "bg-green-500 text-white",
};

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge className={priorityColors[priority] || "bg-gray-300 text-black"}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}

export default PriorityBadge;
