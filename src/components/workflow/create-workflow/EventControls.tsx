/* eslint-disable no-console */
import { saveIcon } from "@/assets/workflow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "reactflow";

const EventControls = ({
  handleSave
}: {
  handleSave: ({
    name,
    description
  }: {
    name: string;
    description: string;
  }) => void;
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleGoBack = () => {
    navigate("/portal/workflows");
  };

  const handleSubmit = () => {
    console.log("Saving workflow:", { name, description });
    handleSave({ name, description });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Panel position="top-left">
        <div className="text-base text-[#221F20] font-medium flex items-center gap-6 bg-white p-4 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div
            onClick={handleGoBack}
            className="text-[16px] font-semibold underline cursor-pointer"
          >
            {"<- Go Back"}
          </div>
          <div className="text-[#221F20] font-semibold text-[16px]">
            Untitled
          </div>

          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <img src={saveIcon} alt="Save" />
            </div>
          </DialogTrigger>
        </div>
      </Panel>
      <DialogContent className="!w-[700px] !max-w-[700px] !h-[403px]">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        <DialogHeader>
          <DialogTitle className="text-[#333333] text-[18px] font-semibold">
            Save your workflow
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <div>
            <label className="text-[#4F4F4F] text-xs font-normal">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name Here..."
              className="mt-1 w-full px-3 py-2  border border-[#E0E0E0] rounded-md text-sm focus:outline-none "
            />
          </div>

          <div>
            <label className="text-[#4F4F4F] text-xs font-normal">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write Here..."
              className="mt-1 w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-[#849E4C]"
            />
          </div>
        </div>
        <div className="flex justify-end items-end">
          <button
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 bg-[#EE3425] text-white text-xs rounded-md cursor-pointer"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventControls;
