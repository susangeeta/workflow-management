import { Panel } from "reactflow";

const EventControls = () => {
  const handleGoBack = () => {
    alert("Go back clicked");
  };

  const handleSave = () => {
    alert("Workflow saved");
  };

  return (
    <Panel position="top-left">
      <div className="absolute text-base text-[#221F20] font-medium flex items-center gap-6 bg-white py-2 w-fit h-fit px-6 top-4 left-4 rounded-sm shadow">
        <button
          onClick={handleGoBack}
          className="flex items-center cursor-pointer"
        >
          {"<- Go Back"}
        </button>
        <span>Untitled</span>
        <button onClick={handleSave} className="cursor-pointer">
          {/* ADD SAVE ICON HERE */}
          Save
        </button>
      </div>
    </Panel>
  );
};

export default EventControls;
