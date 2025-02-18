import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuickActionsProps {
  onAddSubscriber?: () => void;
  onViewReports?: () => void;
  disabled?: boolean;
}

const QuickActions = ({
  onAddSubscriber = () => console.log("Add subscriber clicked"),
  onViewReports = () => console.log("View reports clicked"),
  disabled = false,
}: QuickActionsProps) => {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={onAddSubscriber}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Subscriber
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a new subscriber</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewReports}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Reports
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View detailed reports</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default QuickActions;
