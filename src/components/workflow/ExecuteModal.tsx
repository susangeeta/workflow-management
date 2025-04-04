import React from "react";

interface ExecuteModalProps {
  workflowName: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const ExecuteModal: React.FC<ExecuteModalProps> = ({
  workflowName,
  onClose
}) => {
  if (!workflowName) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-20 flex justify-center items-center">
      <div className="bg-white   rounded-lg shadow-lg w-[596px] h-[224px] text-center relative overflow-hidden">
        <div className="flex justify-between flex-col w-full gap-8">
          <div className="py-8">
            <button
              className="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ✖
            </button>

            <div className="pt-6">
              <p className="text-sm font-semibold text-[#333333]  ">
                "Are You Sure You Want To Execute The Process '{workflowName}'?"
              </p>
              <p className="text-[#EE3425] font-medium text-xs pt-2">
                You Cannot Undo This Step
              </p>
            </div>
          </div>

          <div className="flex justify-end items-end gap-4 p-3 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]  w-full ">
            <button
              onClick={onClose}
              className="text-xs cursor-pointer font-medium px-4 py-2 border rounded-md border-[#E0E0E0] bg-[#FFFFFF] text-[#4F4F4F]"
            >
              Yes
            </button>
            <button
              className="text-xs font-medium cursor-pointer px-4 py-2 border rounded-md border-[#E0E0E0] bg-[#FFFFFF] text-[#4F4F4F]"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecuteModal;
