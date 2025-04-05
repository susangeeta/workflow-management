/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, more, pin, Vector } from "@/assets/workflow";
import { useDb } from "@/hooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@radix-ui/react-popover";
import dayjs from "dayjs";
import { Key, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "../ui/accordion";
import ExecuteModal from "./ExecuteModal";

const WorkFlowTable = ({
  workflows,
  setWorkflows
}: {
  workflows: any[];
  setWorkflows: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [deleteWorkflow, setDeleteWorkflow] = useState<null | {
    id: string;
    name: string;
  }>(null);
  const navigate = useNavigate();
  const { findByIdAndDelete } = useDb();

  const handleExecute = (workflowName: string) => {
    setSelectedWorkflow(workflowName);
  };

  const closeExecuteModal = () => {
    setSelectedWorkflow(null);
  };

  const confirmExecution = () => {
    console.log(`Executing: ${selectedWorkflow}`);
    closeExecuteModal();
  };

  const handleDelete = async () => {
    if (!deleteWorkflow) {
      return;
    }
    try {
      const isDeleted = await findByIdAndDelete("workflows", deleteWorkflow.id);
      if (isDeleted) {
        setWorkflows((prev) =>
          prev.filter((workflow) => workflow.id !== deleteWorkflow.id)
        );
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    } catch (error) {
      Swal.fire("Error", (error as Error).message, "error");
    } finally {
      setDeleteWorkflow(null);
    }
  };
  console.log(workflows);

  return (
    <>
      <div>
        {workflows.length === 0 ? (
          <p className="text-center text-red-500 py-7">No workflow found</p>
        ) : (
          workflows.map((workflow: any, index: any) => (
            <>
              <Accordion type="single" collapsible>
                <AccordionItem value={workflow.id}>
                  <div
                    key={index}
                    className="grid grid-cols-12 items-center border-b border-gray-200 px-3 py-2 text-slate hover:bg-gray-50"
                  >
                    <div className="col-span-2 font-normal text-sm">
                      {workflow.name}
                    </div>
                    <div className="col-span-1 font-normal text-sm">
                      {workflow.id?.slice(0, 6)}...
                    </div>
                    <div className="col-span-3 font-medium text-xs truncate">
                      {workflow?.createdBy?.email} |{" "}
                      {dayjs(workflow.createdAt).format("m:hh, DD MM, YYYY")}
                    </div>
                    <div className="col-span-4 font-medium text-xs">
                      {workflow.description}...
                    </div>
                    <div className="col-span-2 flex justify-end items-center gap-8">
                      <img src={pin} className="h-4 w-4" />
                      <button
                        onClick={() => handleExecute(workflow.name)}
                        className="border cursor-pointer border-gray-300 rounded-md px-3 py-1.5 font-medium text-[12px] hover:bg-yellow-100 hover:border-yellow-500"
                      >
                        Execute
                      </button>
                      <button className="border cursor-pointer border-gray-300 rounded-md px-3 font-medium text-[12px] py-1.5 hover:bg-yellow-100 hover:border-yellow-500">
                        Edit
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <img
                            src={more}
                            className="h-4 w-4 cursor-pointer"
                            title="Delete"
                          />
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          side="bottom"
                          onClick={() =>
                            setDeleteWorkflow({
                              id: workflow.id,
                              name: workflow.name
                            })
                          }
                          className="w-[69px] cursor-pointer h-[37px] flex justify-center items-center bg-[#FFFFFF] text-[#EE3425] underline text-[14px] focus:outline-none text-center rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                        >
                          Delete
                        </PopoverContent>
                      </Popover>

                      <AccordionTrigger>
                        <div className="w-3">
                          <img src={Vector} className="cursor-pointer" />
                        </div>
                      </AccordionTrigger>
                    </div>
                  </div>

                  <AccordionContent className="">
                    <div className="bg-[#fefaf2] p-6 w-full">
                      <div className="relative border-l-2 border-[#FFE1D2] space-y-8">
                        {workflow?.nodes
                          ?.filter(({ type }: { type: string }) =>
                            ["textNode", "emailNode", "apiNode"].includes(type)
                          )
                          .map(
                            (
                              result: {
                                data: any;
                                status: string;
                              },
                              index: Key | null | undefined
                            ) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 relative"
                              >
                                <span className="absolute -left-2 top-0 h-3 w-3 rounded-full bg-[#FF5200] border-2 border-[#FFE1D2]" />

                                <div className="flex gap-6 items-center  w-full">
                                  <span className="text-sm font-normal pl-3 text-gray-700">
                                    {dayjs(result.data.createdAt).format(
                                      "DD/MM - HH:mm IST"
                                    )}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs font-medium  w-14 px-1 py-1 text-center rounded ${
                                        result.status === "Passed"
                                          ? "bg-[#DDEBC0] text-[#221F20]"
                                          : "bg-[#F8AEA8] text-[#221F20]"
                                      }`}
                                    >
                                      {result?.data?.status}
                                    </span>

                                    <img
                                      src={Frame}
                                      onClick={() =>
                                        navigate("create-new-workflow")
                                      }
                                      className="h-4 w-4 cursor-pointer "
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ))
        )}
      </div>

      <ExecuteModal
        workflowName={selectedWorkflow}
        onClose={closeExecuteModal}
        onConfirm={confirmExecution}
      />

      <DeleteModal
        open={!!deleteWorkflow}
        onClose={() => setDeleteWorkflow(null)}
        onConfirm={handleDelete}
        workflowName={deleteWorkflow?.name || ""}
      />
    </>
  );
};

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflowName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  workflowName
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[596px] h-[224px] text-center relative overflow-hidden">
        <div className="flex flex-col w-full gap-8 h-full justify-between">
          <div className="py-8 relative">
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <div className="pt-6 px-6">
              <p className="text-sm font-semibold text-[#333333]">
                Are you sure you want to delete the process "
                <span className="text-black">{workflowName}</span>"?
              </p>
              <p className="text-[#EE3425] font-medium text-xs pt-2">
                You cannot undo this step.
              </p>
            </div>
          </div>

          <div className="flex justify-end items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] gap-4 px-6 py-4 ">
            <button
              onClick={onConfirm}
              className="text-xs font-medium px-4 py-2 cursor-pointer  rounded-md border border-[#E0E0E0] bg-[#FFFFFF] text-[#4F4F4F] hover:bg-gray-100"
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className="text-xs font-medium px-4 py-2 rounded-md cursor-pointer  border border-[#E0E0E0] bg-[#FFFFFF] text-[#4F4F4F] hover:bg-gray-100"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkFlowTable;
