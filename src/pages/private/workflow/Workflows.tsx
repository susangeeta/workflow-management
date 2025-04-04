/* eslint-disable @typescript-eslint/no-explicit-any */
import { hamburger, searchIcon } from "@/assets/workflow";
import TaskHeader from "@/components/workflow/TaskHeader";
import WorkFlowTable from "@/components/workflow/WorkFlowTable";
import { db } from "@/db/db.config";
import { useAuth } from "@/hooks/use-auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const WorkflowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [workflows, setWorkflows] = useState<any[]>([]);
  const navigate = useNavigate();
  const user = useAuth();
  const handleGo = () => {
    navigate("create-new-workflow");
  };

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        if (!user?.uid) {
          return;
        }

        const workflowsRef = collection(db, "workflows");
        const q = query(workflowsRef, where("createdBy.uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedWorkflows = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setWorkflows(fetchedWorkflows);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching workflows:", error);
      }
    };

    fetchWorkflows();
  }, [user?.uid]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(
      (workflow) =>
        workflow.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              <button
                onClick={handleGo}
                className="bg-[#221F20] px-4 py-2 text-white rounded-[6px] text-[12px] font-medium cursor-pointer"
              >
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
