import { Handle, Position } from "reactflow";

const APINode = () => {
  return (
    <div className="p-3 rounded-md border-2 bg-white w-40">
      <Handle type="target" position={Position.Top} />
      <div className="font-medium">API</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default APINode;
