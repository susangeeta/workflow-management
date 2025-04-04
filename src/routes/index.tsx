import { PrivateLayout } from "@/components/layouts";
import LoginPage from "@/pages/auth/Login";
import { NotFoundPage } from "@/pages/error";
import {
  CreateWorkflowPage,
  EditWorkflowPage,
  WorkflowsPage
} from "@/pages/private";
import { Outlet, createBrowserRouter } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

const generateRoutes = () => {
  return createBrowserRouter([
    { path: "/auth/login", element: <LoginPage /> },
    {
      path: "/portal",
      element: (
        <PrivateLayout>
          <Outlet />
        </PrivateLayout>
      ),
      children: [
        {
          path: "workflows",
          children: [
            { index: true, element: <WorkflowsPage /> },
            { path: ":workflowId", element: <EditWorkflowPage /> },
            {
              path: "create-new-workflow",
              element: (
                <ReactFlowProvider>
                  <CreateWorkflowPage />
                </ReactFlowProvider>
              )
            }
          ]
        }
      ]
    },
    { path: "*", element: <NotFoundPage /> }
  ]);
};

export { generateRoutes };
