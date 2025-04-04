/* eslint-disable react-hooks/rules-of-hooks */
import { hamburger, searchIcon } from "@/assets/workflow";
import TaskHeader from "@/components/workflow/TaskHeader";
import WorkFlowTable from "@/components/workflow/WorkFlowTable";
import WorkflowsContext from "@/contexts/WorkflowContext";
import { useContext, useMemo, useState } from "react";

const WorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const context = useContext(WorkflowsContext);

  if (!context) {
    return (
      <p className="text-center text-red-500">Error: Context not found.</p>
    );
  }

  const { workflows } = context;

  // Filter workflows based on search query
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.id.toString().includes(searchQuery)
    );
  }, [workflows, searchQuery]);
  return (
    <div>
      {" "}
      <div className="bg-[#FDFBF6] ">
        <section className="flex gap-5 p-8 items-center">
          <div>
            <img src={hamburger} className="h-9 w-9" />
          </div>
          <div>
            <h1 className="font-semibold text-[22px]  text-[#221F20]">
              Workflow Builder
            </h1>
          </div>
        </section>

        <section className="custom-container flex flex-col ">
          <div className="flex justify-between w-full items-center">
            <div className="relative border border-[#E0E0E0] bg-white  rounded-md  overflow-hidden h-[36px]  w-96">
              <input
                type="text"
                className=" pl-3 w-full h-full outline-none placeholder:text-xxxl font-normal text-sm placeholder:text-[#BDBDBD]"
                placeholder="Search By Workflow Name/ID"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img src={searchIcon} className="absolute right-3 top-2.5" />
            </div>
            <div>
              <button className="bg-[#221F20] px-4 py-2 text-white rounded-[6px] text-[12px] font-medium cursor-pointer">
                + Create New Process
              </button>
            </div>
          </div>
          <section className="py-8">
            <div className="bg-white p-5">
              <TaskHeader />
              <WorkFlowTable workflows={filteredWorkflows} />
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default WorkflowsPage;
