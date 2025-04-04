import { endSvg } from "@/assets/workflow";
import { Handle, Position } from "reactflow";

const EndNode = () => {
  return (
    <div className="">
      <img src={endSvg} alt="" />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default EndNode;
