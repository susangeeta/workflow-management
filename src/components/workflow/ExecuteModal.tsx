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

            <p className="text-sm font-semibold text-[#333333]  ">
              "Are You Sure You Want To Execute The Process '{workflowName}'?"
            </p>
            <p className="text-[#EE3425] font-medium text-xs pt-4">
              You Cannot Undo This Step
            </p>
          </div>

          <div className="flex justify-end items-end gap-4 p-5 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]  w-full ">
            <button className="bg- text-white px-4 py-2 rounded-md hover:bg-green-700">
              Yes
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
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
