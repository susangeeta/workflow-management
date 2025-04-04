/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { more, pin, Vector } from "@/assets/workflow";
import { useState } from "react";
import ExecuteModal from "./ExecuteModal";

const WorkFlowTable = ({ workflows }: { workflows: any[] }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const handleExecute = (workflowName: string) => {
    setSelectedWorkflow(workflowName);
  };

  const closeModal = () => {
    setSelectedWorkflow(null);
  };
  const confirmExecution = () => {
    console.log(`Executing: ${selectedWorkflow}`);
    closeModal();
  };

  return (
    <>
      <div>
        {workflows.length === 0 ? (
          <p className="text-center text-red-500 py-7">No workflows found...</p>
        ) : (
          workflows.map((workflow: any, index: any) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center border-b border-gray-200 px-3 py-4 text-slate hover:bg-gray-50"
            >
              <div className="col-span-3 font-normal text-sm">
                {workflow.name}
              </div>
              <div className="col-span-1 font-normal text-sm">
                {workflow.id}
              </div>
              <div className="col-span-3 font-medium text-xs">
                {workflow.lastEdit}
              </div>
              <div className="col-span-3 font-medium text-xs">
                {workflow.description}
              </div>
              <div className="col-span-2 flex justify-end items-center gap-4">
                <img src={pin} className="h-4 w-4" />
                <button
                  onClick={() => handleExecute(workflow.name)}
                  className="border cursor-pointer border-gray-300 rounded px-3 py-1.5 font-medium text-[12px] hover:bg-[#a6a496] hover:border-[#a59b57]"
                >
                  Execute
                </button>
                <button className="border cursor-pointer border-gray-300 rounded px-3 font-medium text-[12px] py-1.5 hover:bg-gray-50">
                  Edit
                </button>
                <img src={more} className="h-4 w-4" title="Delete" />
                <img src={Vector} className="h-4 w-4" />
              </div>
            </div>
          ))
        )}
      </div>
      <ExecuteModal
        workflowName={selectedWorkflow}
        onClose={closeModal}
        onConfirm={confirmExecution}
      />
    </>
  );
};

export default WorkFlowTable;
