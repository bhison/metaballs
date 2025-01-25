"use client"

import { motion, useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import Metaballs from "./Metaballs";
import { Target } from "./components/target";
import { symbols } from "./consts";
import { useGame } from "./gameContext";
import { calculatedCursorTextOffset } from "./lib/util";

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [scope, animate] = useAnimate();
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const { newGame, gameActive } = useGame();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("called");
    if (!gameActive) {
      newGame();
    }
  }, [newGame, gameActive]);

  useEffect(() => {
    animate(
      scope.current,
      { y: [-20, 15, 0] },
      {
        duration: 0.2,
        ease: "easeOut",
      },
    );
  }, [cursorText, animate, scope]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      setPointerPosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <motion.p
        className="user-select-none relative"
        style={{
          ...titleStyle,
          left:
            pointerPosition.x + calculatedCursorTextOffset(cursorText, scope).x,
          top:
            pointerPosition.y + calculatedCursorTextOffset(cursorText, scope).y,
        }}
        ref={scope}
      >
        {symbols[cursorText as keyof typeof symbols]}
      </motion.p>
      {isClient && <Metaballs setDebugText={setCursorText} />}
      <div
        className="absolute inset-0 bg-black opacity-70 pointer-events-none z-[-10]" // Add this overlay
        style={{
          backgroundImage: "url('/img/cloud-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute top-0 flex flex-col w-full h-full gap-4 items-center p-4 z-20 pointer-events-none">
        <Target className="pointer-events-auto" />
      </div>
    </div>
  );
};

const titleStyle: React.CSSProperties = {
  position: "absolute",
  fontSize: "3rem",
  color: "aliceblue",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  zIndex: 100,
}

export default Page
