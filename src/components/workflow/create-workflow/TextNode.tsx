import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: data.metadata || ""
    }
  });

  const onSubmit = (values: FormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, metadata: values.message } }
          : node
      )
    );
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="p-3 rounded-md border-2 bg-white w-40 cursor-pointer relative">
          <Handle type="target" position={Position.Top} />
          <div className="font-medium text-center">{data.label || "Text"}</div>
          <button
            className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded px-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            x
          </button>
          <Handle type="source" position={Position.Bottom} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-87 h-31 p-6 bg-white rounded-sm border-none shadow-[0px_0px_4px_0px_rgba(98,127,172,0.2)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type here"
                      {...field}
                      className="text-black py-1.5 px-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full hidden">
              Save
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default TextNode;
