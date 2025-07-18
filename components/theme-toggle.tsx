/* ThemeToggle.tsx */
"use client";

import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();


  const handleChange = (value: string) => {
    setTheme(value);
  };

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={handleChange}
      className="gap-1"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="light" aria-label="Light mode">
            <Sun className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Light</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="dark" aria-label="Dark mode">
            <Moon className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Dark</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="system" aria-label="System">
            <Monitor className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>System</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}

export default ThemeToggle;
