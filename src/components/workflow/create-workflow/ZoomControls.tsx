import { Panel, ReactFlowInstance, ReactFlowState, useStore } from "reactflow";

interface ZoomControlsProps {
  reactFlowInstance: React.RefObject<ReactFlowInstance | null>;
}

const zoomFn = (state: ReactFlowState) => {
  return {
    zoom: state.transform[2]
  };
};

const ZoomControls = ({ reactFlowInstance }: ZoomControlsProps) => {
  const { zoom } = useStore(zoomFn);

  return (
    <Panel position="bottom-right">
      <div className="absolute bg-white rounded-md border border-[#E0E0E0] bottom-6 right-6 flex items-center">
        <button
          onClick={() => reactFlowInstance.current?.zoomOut()}
          className="w-8 h-8 flex items-center justify-center"
        >
          -
        </button>

        <div className="mx-2 w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            style={{
              width: (zoom - 0.5) * 100
            }}
            className="h-full bg-green-500 rounded-full"
          ></div>
        </div>

        <button
          onClick={() => reactFlowInstance.current?.zoomIn()}
          className="w-8 h-8 flex items-center justify-center"
        >
          +
        </button>
      </div>
    </Panel>
  );
};

export default ZoomControls;
