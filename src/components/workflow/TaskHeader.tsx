const TaskHeader = () => {
  return (
    <div className="grid grid-cols-12 border-b-2 border-orange text-black p-2 text-sm font-semibold">
      <div className="col-span-2">Workflow Name</div>
      <div className="col-span-1">ID</div>
      <div className="col-span-3">Last Edited On</div>
      <div className="col-span-4">Description</div>
      <div className="col-span-2"></div>
    </div>
  );
};

export default TaskHeader;
