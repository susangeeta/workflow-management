import deleteIcon from "@/assets/workflow/delete.svg";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db } from "@/db/db.config";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import Swal from "sweetalert2";
import * as z from "zod";

interface ApiNodeProps extends NodeProps {
  onDelete: (id: string) => void;
}

const formSchema = z.object({
  method: z.enum(["GET", "POST"], {
    errorMap: () => ({ message: "Please select a method" })
  }),
  url: z.string().url({ message: "Please enter a valid URL" }),
  headers: z.string().optional(),
  body: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const ApiNode = ({ id, data, onDelete }: ApiNodeProps) => {
  const { setNodes } = useReactFlow();
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const currentUser = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: data.metadata,
      url: data.metadata?.url || "",
      headers: data.metadata?.headers || "",
      body: data.metadata?.body || ""
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

      const nodeRef = doc(db, "apiNodes", id);
      await setDoc(nodeRef, {
        nodeId: id,
        label: data.label || "API",
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email || "anonymous",
        ...values
      });

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "API node details have been saved.",
        timer: 2000,
        showConfirmButton: false
      });

      setOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error saving API node to Firebase:", error);
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
        <div
          className="p-3 rounded-md border-2 bg-[#FFFFFF] border-[#849E4C] w-[300px] hover:bg-[#F7FAEF] h-[64px] cursor-pointer relative"
          onClick={(e) => e.stopPropagation()}
        >
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
              className="space-y-3 mt-4"
            >
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#4F4F4F] font-normal">
                      Method
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value}
                        className="w-full border border-[#E0E0E0] rounded-md px-3 py-1.5 text-black focus:outline-none"
                      >
                        <option
                          value=""
                          disabled
                          className="text-[#E0E0E0] text-sm "
                        >
                          Type here...
                        </option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#4F4F4F] font-normal">
                      URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type Here..."
                        className="w-full placeholder-[#E0E0E0] border border-[#E0E0E0] rounded-md px-3 py-2 text-black focus:outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#4F4F4F] font-normal">
                      Headers
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Headers Name"
                        {...field}
                        className="w-full placeholder-[#E0E0E0] border border-[#E0E0E0] rounded-md px-3 py-2 text-black focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#4F4F4F] font-normal">
                      Body
                    </FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Enter Description..."
                        className="w-full placeholder-[#E0E0E0] border border-[#E0E0E0] rounded-md px-3 py-2 text-black min-h-[100px] resize-none focus:outline-none"
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

export default ApiNode;
