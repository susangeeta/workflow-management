/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import {
  ApiNode,
  EmailNode,
  EndNode,
  EventControls,
  PlusNode,
  StartNode,
  TextNode,
  ZoomControls
} from "@/components/workflow/create-workflow";
import { useDb } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, {
  Background,
  Connection,
  NodeTypes,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";

const initialEdges = [
  {
    id: "start-plus-1",
    source: "start",
    target: "plus-1",
    type: "straight"
  },
  {
    id: "plus-1-end",
    source: "plus-1",
    target: "end",
    type: "straight"
  }
];

const FIXED_X_FOR_NODE = 300;
const FIXED_X_FOR_PLUS = 325;

const WorkflowCreator = () => {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "start",
      type: "startNode",
      position: { x: FIXED_X_FOR_NODE, y: 50 },
      data: { label: "Start" },
      selectable: false
    },
    {
      id: "plus-1",
      type: "plusNode",
      position: { x: FIXED_X_FOR_PLUS, y: 200 },
      data: {
        onSelect: (nodeType: string) => handleInsertNode("plus-1", nodeType)
      }
    },
    {
      id: "end",
      type: "endNode",
      position: { x: FIXED_X_FOR_NODE, y: 300 },
      data: { label: "End" },
      selectable: false
    }
  ]);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const user = useAuth();
  const { create } = useDb();
  const navigate = useNavigate();

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: "straight" }, eds));
    },
    [setEdges]
  );

  const handleInsertNode = useCallback(
    (plusNodeId: string, nodeType: string) => {
      const nodeCount = crypto.randomUUID();

      setNodes((currentNodes) => {
        const newNodeId = `${nodeType}-${nodeCount}`;
        const plusAboveId = `plus-above-${nodeCount}`;
        const plusBelowId = `plus-below-${nodeCount}`;

        const plusNode = currentNodes.find((n) => n.id === plusNodeId);
        if (!plusNode) {
          return currentNodes;
        }

        const insertY = plusNode.position.y;

        const filteredNodes = currentNodes.filter((n) => n.id !== plusNodeId);

        const SPACING = 100;
        const plusAbove = {
          id: plusAboveId,
          type: "plusNode",
          position: { x: FIXED_X_FOR_PLUS, y: insertY },
          data: {
            onSelect: (type: string) => handleInsertNode(plusAboveId, type)
          }
        };

        const newNode = {
          id: newNodeId,
          type: nodeType,
          position: { x: FIXED_X_FOR_NODE, y: insertY + SPACING },
          data: {
            label: nodeType.replace("Node", ""),
            method: "",
            url: "",
            headers: "",
            body: "",
            metadata: "",
            status: "Paused",
            createdAt: new Date().toISOString()
          }
        };

        const plusBelow = {
          id: plusBelowId,
          type: "plusNode",
          position: { x: FIXED_X_FOR_PLUS, y: insertY + SPACING * 2 },
          data: {
            onSelect: (type: string) => handleInsertNode(plusBelowId, type)
          }
        };

        const updatedNodes = filteredNodes.map((n) => {
          if (n.position.y > insertY) {
            return {
              ...n,
              position: { ...n.position, y: n.position.y + SPACING * 2 }
            };
          }
          return n;
        });

        return [...updatedNodes, plusAbove, newNode, plusBelow];
      });

      setEdges((currentEdges) => {
        let source = "start";
        let target = "end";

        currentEdges.forEach((edge) => {
          if (edge.target === plusNodeId) {
            source = edge.source;
          }
          if (edge.source === plusNodeId) {
            target = edge.target;
          }
        });

        const newEdges = currentEdges.filter(
          (e) => e.source !== plusNodeId && e.target !== plusNodeId
        );

        return [
          ...newEdges,
          {
            id: `${source}-plus-above-${nodeCount}`,
            source,
            target: `plus-above-${nodeCount}`,
            type: "straight"
          },
          {
            id: `plus-above-${nodeCount}-${nodeType}-${nodeCount}`,
            source: `plus-above-${nodeCount}`,
            target: `${nodeType}-${nodeCount}`,
            type: "straight"
          },
          {
            id: `${nodeType}-${nodeCount}-plus-below-${nodeCount}`,
            source: `${nodeType}-${nodeCount}`,
            target: `plus-below-${nodeCount}`,
            type: "straight"
          },
          {
            id: `plus-below-${nodeCount}-${target}`,
            source: `plus-below-${nodeCount}`,
            target,
            type: "straight"
          }
        ];
      });
    },
    [setEdges, setNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prevNodes) => {
        const index = prevNodes.findIndex((n) => n.id === nodeId);
        if (index === -1) {
          return prevNodes;
        }

        const prev = prevNodes[index - 1];
        const next = prevNodes[index + 1];
        const nodeToDelete = prevNodes[index];

        const newNodes = prevNodes.filter(
          (_, i) => i !== index && i !== index - 1 && i !== index + 1
        );

        if (
          prev &&
          next &&
          prev.type !== "startNode" &&
          next.type !== "endNode"
        ) {
          const newPlusId = `plus-${crypto.randomUUID()}`;
          newNodes.push({
            id: newPlusId,
            type: "plusNode",
            position: {
              x: FIXED_X_FOR_PLUS,
              y: nodeToDelete?.position.y || 0
            },
            data: {
              onSelect: (type: string) => handleInsertNode(newPlusId, type)
            }
          });
        }

        return newNodes;
      });

      setEdges((prevEdges) => {
        const sourceEdge = prevEdges.find((e) => e.target === nodeId);
        const targetEdge = prevEdges.find((e) => e.source === nodeId);

        const newEdges = prevEdges.filter(
          (e) =>
            e.source !== nodeId &&
            e.target !== nodeId &&
            !e.source.includes("plus") &&
            !e.target.includes("plus")
        );

        if (sourceEdge && targetEdge) {
          newEdges.push({
            id: `${sourceEdge.source}-${targetEdge.target}`,
            source: sourceEdge.source,
            target: targetEdge.target,
            type: "straight"
          });
        }

        return newEdges;
      });
    },
    [setNodes, setEdges, handleInsertNode]
  );

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      startNode: StartNode,
      endNode: EndNode,
      plusNode: PlusNode,
      apiNode: (props) => <ApiNode {...props} onDelete={handleDeleteNode} />,
      emailNode: (props) => (
        <EmailNode {...props} onDelete={handleDeleteNode} />
      ),
      textNode: (props) => <TextNode {...props} onDelete={handleDeleteNode} />
    }),
    [handleDeleteNode]
  );
  console.log(user);

  const handleSave = async ({
    name,
    description
  }: {
    name: string;
    description: string;
  }) => {
    const workflowData = {
      name,
      description,
      createdAt: new Date().toISOString(),
      createdBy: {
        displayName: user?.displayName,
        email: user?.email,
        uid: user?.uid
      },

      nodes: nodes.map(({ data, ...rest }) => ({
        ...rest,
        data: Object.fromEntries(
          Object.entries(data).filter(
            ([_, value]) => typeof value !== "function"
          )
        )
      })),

      edges
    };

    try {
      await create("workflows", workflowData);
      navigate("/portal/workflows");
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
  };

  return (
    <div ref={reactFlowWrapper} className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 400, y: 200, zoom: 1 }}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
        className="bg-yellow-50"
      >
        <Background gap={12} size={1} />

        <div>
          <EventControls
            handleSave={handleSave}
            isSaveEnable={
              nodes?.filter(({ type }) =>
                ["textNode", "emailNode", "apiNode"].includes(type!)
              ).length > 0
            }
          />
        </div>
        <ZoomControls reactFlowInstance={reactFlowInstance} />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCreator;
