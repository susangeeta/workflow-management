/* eslint-disable no-console */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { hamburger, leftIcon, rightIcon, searchIcon } from "@/assets/workflow";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const user = useAuth();

  const handleGo = () => {
    navigate("create-new-workflow");
  };

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        if (!user?.uid) return;
        setLoading(true);
        const workflowsRef = collection(db, "workflows");
        const q = query(workflowsRef, where("createdBy.uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedWorkflows = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setLoading(false);
        setWorkflows(fetchedWorkflows);
      } catch (error) {
        console.error("Error fetching workflows:", error);
      } finally {
        setLoading(false);
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

  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage);

  const paginatedWorkflows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWorkflows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWorkflows, currentPage]);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="bg-[#FDFBF6]">
      <section className="flex gap-5 p-8 items-center">
        <img src={hamburger} className="h-9 w-9" />
        <h1 className="font-semibold text-[22px] text-[#221F20]">
          Workflow Builder
        </h1>
      </section>

      <section className="custom-container flex flex-col">
        <div className="flex justify-between w-full items-center">
          <div className="relative border border-[#E0E0E0] bg-white rounded-md overflow-hidden h-[36px] w-96">
            <input
              type="text"
              className="pl-3 w-full h-full outline-none placeholder:text-xxxl font-normal text-sm placeholder:text-[#BDBDBD]"
              placeholder="Search By Workflow Name/ID"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src={searchIcon} className="absolute right-3 top-2.5" />
          </div>

          <button
            onClick={handleGo}
            className="bg-[#221F20] px-4 py-2 text-white rounded-[6px] text-[12px] font-medium cursor-pointer"
          >
            + Create New Process
          </button>
        </div>

        <section className="py-8">
          <div className="bg-white p-5">
            <TaskHeader />
            {loading ? (
              <div className="text-red-600 text-center pt-6">Loading</div>
            ) : (
              <WorkFlowTable
                workflows={paginatedWorkflows}
                setWorkflows={setWorkflows}
              />
            )}

            {workflows.length > 0 && (
              <div className="flex justify-end mt-4 gap-2 items-center">
                <img
                  src={rightIcon}
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className={`h-4 w-4 ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                />

                {Array.from({ length: totalPages }, (_, index) => {
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    Math.abs(index + 1 - currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-8 h-8 text-sm cursor-pointer font-medium rounded-md transition-all duration-150 ${
                          currentPage === index + 1
                            ? "bg-[#FEF3E9] text-black"
                            : "bg-white text-black border border-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  }

                  if (index === currentPage - 3 || index === currentPage + 1) {
                    return (
                      <span key={index} className="px-1 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                <img
                  src={leftIcon}
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={`h-4 w-4 ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                />
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

export default WorkflowsPage;
