import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@radix-ui/react-popover";
import { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const PlusNode = ({ data }: NodeProps) => {
  const [open, setOpen] = useState(false);

  const actionArr = [
    {
      title: "API Call",
      fn: () => {
        data.onSelect("apiNode");
        setOpen(false);
      }
    },
    {
      title: "Email",
      fn: () => {
        data.onSelect("emailNode");
        setOpen(false);
      }
    },
    {
      title: "Text Box",
      fn: () => {
        data.onSelect("textNode");
        setOpen(false);
      }
    }
  ];

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="cursor-pointer text-2xl font-light text-[#4F4F4F] border bg-white flex items-center justify-center w-7 h-7 rounded-full border-[#4F4F4F]">
            +
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-50 bg-white rounded-sm border-none shadow-[0px_0px_4px_0px_rgba(98,127,172,0.2)]"
          align="start"
          side="right"
        >
          <div className="flex flex-wrap gap-x-4 gap-y-3 p-4">
            {actionArr.map((action, index) => (
              <div
                key={index}
                onClick={() => action?.fn()}
                className="px-3 py-2 cursor-pointer text-black rounded-md border border-[#E0E0E0] text-xs font-medium"
              >
                {action.title}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default PlusNode;
