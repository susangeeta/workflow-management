/* eslint-disable require-await */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { more, pin, Vector } from "@/assets/workflow";
import { useDb } from "@/hooks";
import { useState } from "react";
import Swal from "sweetalert2";
import ExecuteModal from "./ExecuteModal";

const WorkFlowTable = ({ workflows }: { workflows: any[] }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const { findByIdAndDelete } = useDb();
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

  const handleDeleteTask = async (docId: string) => {
    Swal.fire({
      title: "Are you sure you want to Delete 'Process_Name'?",
      text: "You cannot Undo this step",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const isDeleted = await findByIdAndDelete("workflows", docId);
          if (isDeleted) {
            Swal.fire("Deleted!", "Your task has been deleted.", "success");
          }
        } catch (error) {
          Swal.fire("Error", (error as Error).message, "error");
        }
      }
    });
  };
  return (
    <>
      <div>
        {workflows.length === 0 ? (
          <p className="text-center text-red-500 py-7">Loading...</p>
        ) : (
          workflows.map((workflow: any, index: any) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center border-b border-gray-200 px-3 py-3 text-slate hover:bg-gray-50"
            >
              <div className="col-span-2 font-normal text-sm">
                {workflow.name}
              </div>
              <div className="col-span-1 font-normal text-sm">
                {workflow.id?.slice(0, 6)}...
              </div>
              <div className="col-span-3 font-medium text-xs">
                zubin Khanna | 22:43 IST - 28/05
              </div>
              <div className="col-span-4 font-medium text-xs">
                {workflow.description}...
              </div>
              <div className="col-span-2 flex justify-end items-center gap-8">
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
                <img
                  onClick={() => handleDeleteTask(workflow.id)}
                  src={more}
                  className="h-4 w-4"
                  title="Delete"
                />
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
