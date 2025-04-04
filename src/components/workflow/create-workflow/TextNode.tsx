/* eslint-disable no-console */
import { deleteIcon } from "@/assets/workflow";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { db } from "@/db/db.config";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import Swal from "sweetalert2";
import * as z from "zod";

interface TextNodeProps extends NodeProps {
  onDelete: (id: string) => void;
}

const formSchema = z.object({
  message: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const TextNode = ({ id, data, onDelete }: TextNodeProps) => {
  const { setNodes } = useReactFlow();
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const currentUser = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: data.metadata || ""
    }
  });

  const onSubmit = async (values: FormValues) => {
    setloading(true);
    try {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, metadata: values.message } }
            : node
        )
      );

      const nodeRef = doc(db, "textNodes", id);
      await setDoc(nodeRef, {
        nodeId: id,
        label: data.label || "Text",
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email || "anonymous",
        message: values.message || ""
      });

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Text node has been saved successfully.",
        timer: 2000,
        showConfirmButton: false
      });

      setOpen(false);
    } catch (err) {
      console.error("Error saving text node:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save text node."
      });
    }
    setloading(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="p-3 rounded-md border-2 bg-[#FFFFFF] border-[#849E4C] w-[300px] hover:bg-[#F7FAEF]  h-[64px] cursor-pointer relative">
          <Handle type="target" position={Position.Top} />
          <div className="flex justify-between w-full items-center">
            <div className="font-medium text-center uppercase pt-2 pl-3">
              {data.label || "Text Box"}
            </div>

            <div>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                src={deleteIcon}
                alt="Delete"
              />
            </div>
          </div>
          <Handle type="source" position={Position.Bottom} />
        </div>
      </DialogTrigger>

      <div className="relative w-full">
        <DialogContent className="!absolute top-[25rem] right-[7rem] w-[380px] translate-x-[25rem]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 py-2"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#4F4F4F] font-normal">
                      Message
                    </FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Enter"
                        className="w-full placeholder-[#E0E0E0] border border-[#E0E0E0] rounded-md px-3 py-2 text-black min-h-[100px] resize-none focus:outline-none focus:ring-0 focus:border-[#E0E0E0]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-[#849E4C] cursor-pointer text-white py-2 rounded-md hover:bg-[#6f853f] transition-colors"
              >
                {loading ? "Loading..." : "Save"}
              </button>
            </form>
          </Form>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default TextNode;
