import { createRef, RefObject, useEffect } from "react";

import { PointerCanvasStyle } from "./styles";

interface PointerCanvasProps extends DrawPointerProps {
  width: string;
  height: string;
}

interface DrawPointerProps {
  outerBorderColor: string;
  outerBorderWidth: number;
}

const drawPointer = (
  canvasRef: RefObject<HTMLCanvasElement>,
  drawWheelProps: DrawPointerProps
) => {
  /* eslint-disable prefer-const */
  let { outerBorderColor, outerBorderWidth } = drawWheelProps;

  outerBorderWidth *= 2;

  const canvas = canvasRef.current;
  if (canvas?.getContext("2d")) {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 500, 500);
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 0;

    const centerX = canvas.width / 2;

    // WHEEL POINTER
    ctx.fillStyle = "white";
    ctx.strokeStyle = outerBorderWidth <= 0 ? "transparent" : outerBorderColor;
    ctx.lineWidth = outerBorderWidth;
    ctx.beginPath();
    // ctx.moveTo(16.5, 42);
    ctx.lineTo(3 + centerX - 25, 13 - 1);
    ctx.lineTo(25 + centerX - 25, 3 - 1);
    ctx.lineTo(45 + centerX - 25, 13 - 1);
    ctx.lineTo(25 + centerX - 25, 56 - 1);

    <svg
      width="32"
      height="45"
      viewBox="0 0 32 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 42L2 9.5L16.5 2L30 9.5L16.5 42Z"
        fill="white"
        stroke="#0D1615"
        stroke-width="2"
      />
    </svg>;

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
};

const PointerCanvas = ({
  width,
  height,
  outerBorderColor,
  outerBorderWidth,
}: PointerCanvasProps): JSX.Element => {
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    const drawPointerProps = {
      outerBorderColor,
      outerBorderWidth,
    };

    drawPointer(canvasRef, drawPointerProps);
  }, [canvasRef, outerBorderColor, outerBorderWidth]);

  return <PointerCanvasStyle ref={canvasRef} width={width} height={height} />;
};

export default PointerCanvas;
