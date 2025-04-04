/* eslint-disable no-console */
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

const API_URL = "https://my-workflows.free.beeceptor.com/workflows";

interface WorkflowsContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workflows: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setWorkflows: (workflows: any[]) => void;
}

const WorkflowsContext = createContext<WorkflowsContextType | undefined>(
  undefined
);

export const WorkflowsProvider = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [workflows, setWorkflows] = useState<any[]>([]);

  useEffect(() => {
    console.log("Fetching workflows...");
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setWorkflows(data))
      .catch((error) => console.error("Error fetching workflows:", error));
  }, []);

  return (
    <WorkflowsContext.Provider value={{ workflows, setWorkflows }}>
      {children}
    </WorkflowsContext.Provider>
  );
};
export const useWorkflows = () => {
  const context = useContext(WorkflowsContext);
  if (!context) {
    throw new Error("useWorkflows must be used within a WorkflowsProvider");
  }
  return context;
};

export default WorkflowsContext;
