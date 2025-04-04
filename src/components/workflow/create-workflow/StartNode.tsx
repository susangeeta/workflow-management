import { startSvg } from "@/assets/workflow";
import { Handle, Position } from "reactflow";

const StartNode = () => {
  return (
    <div className="">
      <img src={startSvg} alt="" />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default StartNode;
