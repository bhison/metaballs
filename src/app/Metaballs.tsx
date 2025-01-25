"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { calculateRelativeDirection, generateBalls, hexToRgb } from "./lib/util"
import { Metaball } from "./types"

const Metaballs = ({
  setDebugText,
  className,
}: {
  setDebugText: (text: string) => void
  className?: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [metaballs, setMetaballs] = useState<Metaball[]>(generateBalls(6));
  const [dragging, setDragging] = useState<number | null>(null);

  const threshold = 1.0; // Threshold for contour

  // Define color variables using hex codes
  const intersectingColorHex = "#11B4FF";
  const nonIntersectingColorHex = "#11D4FF";
  const textColorHex = "#DEF";

  // Convert the hex colors to RGB once
  const intersectingColorRGB = hexToRgb(intersectingColorHex);
  const nonIntersectingColorRGB = hexToRgb(nonIntersectingColorHex);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear with transparency

    const drawMetaballs = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      const intersectingBalls = findIntersectingBalls();

      let anyIntersecting = false;
      let debugText = "";

      if (dragging !== null) {
        const draggedBall = metaballs[dragging];
        intersectingBalls.forEach((i) => {
          if (i !== dragging) {
            const position = calculateRelativeDirection(
              draggedBall,
              metaballs[i],
            );
            if (position) {
              debugText = position; // Set the debug text based on the position
              anyIntersecting = true;
            }
          }
        });
      }

      // Draw metaballs
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const fieldStrength = calculateField(x, y);
          const index = (x + y * width) * 4;

          if (fieldStrength > threshold) {
            const isIntersecting = isPixelInfluencedByIntersectingBall(
              x,
              y,
              intersectingBalls,
            );

            if (isIntersecting) {
              anyIntersecting = true;
              // Use intersectingColorRGB array
              data[index] = intersectingColorRGB[0]; // Red
              data[index + 1] = intersectingColorRGB[1]; // Green
              data[index + 2] = intersectingColorRGB[2]; // Blue
            } else {
              // Use nonIntersectingColorRGB array
              data[index] = nonIntersectingColorRGB[0]; // Red
              data[index + 1] = nonIntersectingColorRGB[1]; // Green
              data[index + 2] = nonIntersectingColorRGB[2]; // Blue
            }
            data[index + 3] = 255; // Alpha (opaque)
          }
        }
      }

      ctx.putImageData(imageData, 0, 0); // Draw the filled metaballs first

      ctx.strokeStyle = "rgba(119, 255, 255, 0.5)";

      ctx.lineWidth = 2.5; // Set outline width to 2 pixels

      // Draw the outline based on the filled metaballs
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const fieldStrength = calculateField(x, y);

          // Check if the current pixel is on the edge of a metaball
          if (fieldStrength > threshold) {
            // Check surrounding pixels to determine if this pixel is an edge
            const isEdge = [
              calculateField(x - 1, y),
              calculateField(x + 1, y),
              calculateField(x, y - 1),
              calculateField(x, y + 1),
            ].some((strength) => strength <= threshold);

            if (isEdge) {
              ctx.beginPath();
              ctx.arc(x, y, 1, 0, Math.PI * 2); // Draw a small circle for the outline
              ctx.stroke(); // Draw the outline
            }
          }
        }
      }

      setDebugText(anyIntersecting ? debugText : "");

      // Draw the initial radius text on each metaball in white
      ctx.font = "bold 32px 'Arial'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      metaballs.forEach(
        (
          metaball: { x: number; y: number; initialRadius: number },
          index: number,
        ) => {
          // Check if the current metaball is intersecting
          const isIntersecting = intersectingBalls.has(index);
          ctx.fillStyle = isIntersecting ? "#FFFFFF" : textColorHex; // Change text color to white if intersecting
          ctx.fillText(
            Math.round(metaball.initialRadius).toString(),
            metaball.x,
            metaball.y,
          );
        },
      );
    };

    const calculateField = (x: number, y: number) => {
      return metaballs.reduce((sum, ball) => {
        const dx = x - ball.x;
        const dy = y - ball.y;
        return sum + (ball.radius * ball.radius) / (dx * dx + dy * dy);
      }, 0);
    };

    const findIntersectingBalls = () => {
      const intersecting = new Set<number>();
      for (let i = 0; i < metaballs.length; i++) {
        for (let j = i + 1; j < metaballs.length; j++) {
          const ball1 = metaballs[i];
          const ball2 = metaballs[j];
          const dx = ball1.x - ball2.x;
          const dy = ball1.y - ball2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < ball1.radius + ball2.radius) {
            intersecting.add(i);
            intersecting.add(j);
          }
        }
      }
      return intersecting;
    };

    const isPixelInfluencedByIntersectingBall = (
      x: number,
      y: number,
      intersectingBalls: Set<number>,
    ) => {
      let totalInfluence = 0;
      intersectingBalls.forEach((i) => {
        const ball = metaballs[i];
        const dx = x - ball.x;
        const dy = y - ball.y;
        totalInfluence += (ball.radius * ball.radius) / (dx * dx + dy * dy);
      });
      return totalInfluence > threshold;
    };

    drawMetaballs();
  }, [
    metaballs,
    setDebugText,
    intersectingColorRGB,
    nonIntersectingColorRGB,
    dragging,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ballIndex = metaballs.findIndex((ball) =>
      isInsideMetaball(offsetX, offsetY, ball),
    );
    if (ballIndex !== -1) {
      setDragging(ballIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ballIndex = metaballs.findIndex((ball) =>
      isInsideMetaball(offsetX, offsetY, ball),
    );

    // Change cursor style based on whether the mouse is over a metaball
    if (ballIndex !== -1) {
      canvasRef.current!.style.cursor =
        dragging !== null ? "grabbing" : "pointer";
    } else {
      canvasRef.current!.style.cursor = "default";
    }

    if (dragging !== null) {
      const newMetaballs = [...metaballs];
      newMetaballs[dragging] = {
        ...newMetaballs[dragging],
        x: offsetX,
        y: offsetY,
      };
      setMetaballs(newMetaballs);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    // Reset cursor style when mouse is released
    canvasRef.current!.style.cursor = "default";
  };

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;
      const ballIndex = metaballs.findIndex((ball) =>
        isInsideMetaball(offsetX, offsetY, ball),
      );
      if (ballIndex !== -1) {
        setDragging(ballIndex);
      }
    },
    [metaballs],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (dragging !== null) {
        const touch = e.touches[0];
        const { clientX, clientY } = touch;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;
        const newMetaballs = [...metaballs];
        newMetaballs[dragging] = {
          ...newMetaballs[dragging],
          x: offsetX,
          y: offsetY,
        };
        setMetaballs(newMetaballs);
      }
    },
    [dragging, metaballs],
  );

  const handleTouchEnd = () => {
    setDragging(null);
  };

  const isInsideMetaball = (
    x: number,
    y: number,
    ball: { x: number; y: number; radius: number },
  ) => {
    const dx = x - ball.x;
    const dy = y - ball.y;
    return Math.sqrt(dx * dx + dy * dy) < ball.radius;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Add touch event listeners
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      // Clean up touch event listeners
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [metaballs, dragging, handleTouchStart, handleTouchMove]);

  return (
    <canvas
      className={className}
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: "1px solid black", display: "block" }}
    />
  );
}

export default Metaballs

