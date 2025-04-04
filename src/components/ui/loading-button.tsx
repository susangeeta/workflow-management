import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

const LoadingButton = ({
  className,
  children,
  loading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) => {
  return (
    <Button
      disabled={loading || props.disabled}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-white/10"
        initial={{ x: "-100%" }}
        animate={{ x: loading ? "100%" : "-100%" }}
        transition={{
          repeat: loading ? Number.POSITIVE_INFINITY : 0,
          duration: 1,
          ease: "linear"
        }}
      />
      {loading ? (
        <div className="flex items-center gap-2">
          Loading
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
          />
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
