import { RouterProvider } from "react-router-dom";
import { WorkflowsProvider } from "./contexts/WorkflowContext";
import { generateRoutes } from "./routes";

function App() {
  return (
    <WorkflowsProvider>
      <RouterProvider router={generateRoutes()} />
    </WorkflowsProvider>
  );
}

export default App;
