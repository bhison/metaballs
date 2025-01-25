import { motion } from "framer-motion";
import { useGame } from "../gameContext";
import { cn } from "../lib/util";

export const Target = ({ className }: { className?: string }) => {
  const { target, submitHovered, setSubmitHovered } = useGame();

  return (
    <div className={cn("relative mt-6", className)}>
      <span
        className="font-extrabold absolute z-20 text-2xl text-center w-full mt-[-1.75rem]"
        style={{
          color: "#EEB366",
          textShadow: "2px 2px 1px #FE5937",
        }}
      >
        TARGET
      </span>
      <motion.div
        className={cn(
          "min-w-[12rem] p-[1%] rounded-[2rem] contain-content flex shadow-lg border-4 border-yellow-300 tansition-color transition-scale cursor-pointer duration-150 opacity-90",
          submitHovered ? "bg-green-600 p-[3%]" : "bg-red-500",
          className,
        )}
        onClick={() => setSubmitHovered(!submitHovered)}
        animate={
          submitHovered
            ? {
                y: [0, -15, 0],
                transition: {
                  duration: 0.1,
                  ease: "easeOut",
                  times: [0, 0.3, 1],
                },
              }
            : {}
        }
      >
        <span className="text-[3rem] text-center text-yellow-300 w-full user-select-none">
          {target}
        </span>
      </motion.div>
    </div>
  );
};
