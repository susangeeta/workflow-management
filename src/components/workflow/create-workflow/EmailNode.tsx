import deleteIcon from "@/assets/workflow/delete.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useState } from "react";
import * as z from "zod";

import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

// Import your Dialog components
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/db/db.config";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

interface ApiNodeProps extends NodeProps {
  onDelete: (id: string) => void;
}
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});
type FormValues = z.infer<typeof formSchema>;

const EmailNode = ({ id, data, onDelete }: ApiNodeProps) => {
  const { setNodes } = useReactFlow();

  const currentUser = useAuth();
  const [loading, setloading] = useState(false);

  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: data.email || ""
    }
  });

  const onSubmit = async (values: FormValues) => {
    setloading(true);
    try {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, metadata: values } }
            : node
        )
      );

      const nodeRef = doc(db, "emailNodes", id);
      await setDoc(nodeRef, {
        nodeId: id,
        label: data.label || "Email",
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email || "anonymous",
        ...values
      });

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Email node details have been saved.",
        timer: 2000,
        showConfirmButton: false
      });

      setOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error saving Email node to Firebase:", error);

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while saving."
      });
    }
    setloading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="p-3 rounded-md border-2 bg-[#FFFFFF] border-[#849E4C] w-[300px] hover:bg-[#F7FAEF]  h-[64px] cursor-pointer relative">
          <Handle type="target" position={Position.Top} />
          <div className="flex justify-between w-full items-center">
            <div className="font-medium text-center uppercase pt-2 pl-3">
              {data.label || "API"}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#4F4F4F] font-normal">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type Here..."
                        className="w-full  placeholder-[#E0E0E0] border  border-[#E0E0E0] rounded-md px-3 py-2 text-black focus:outline-none"
                        {...field}
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

export default EmailNode;
