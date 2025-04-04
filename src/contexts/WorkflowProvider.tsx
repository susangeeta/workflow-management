/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorkflowsProvider } from "./WorkflowContext";

function MyApp({ Component, pageProps }: any) {
  return (
    <WorkflowsProvider>
      <Component {...pageProps} />
    </WorkflowsProvider>
  );
}

export default MyApp;
