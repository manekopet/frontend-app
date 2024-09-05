import { styled } from "@mui/material";

export const RouletteContainer = styled("div")`
  position: relative;
  width: 100%;
  padding-top: 100%;
  object-fit: contain;
  flex-shrink: 0;
  z-index: 5;
  pointer-events: none;
`;

export interface RotationContainerProps {
  className: string;
  classKey: string;
  startSpinningTime: number;
  continueSpinningTime: number;
  stopSpinningTime: number;
  startRotationDegrees: number;
  finalRotationDegrees: number;
  disableInitialAnimation: boolean;
}
export const RotationContainer = styled("div", {
  shouldForwardProp: (prop: string) =>
    [
      "className",
      "classKey",
      "startSpinningTime",
      "continueSpinningTime",
      "stopSpinningTime",
      "startRotationDegrees",
      "finalRotationDegrees",
      "disableInitialAnimation",
    ].indexOf(prop) === -1,
})<RotationContainerProps>`
  position: absolute;
  width: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(${(props) => props.startRotationDegrees}deg);

  &.started-spinning {
    animation: spin-${({ classKey }) => classKey} ${({ startSpinningTime }) =>
          startSpinningTime / 1000}s cubic-bezier(
          0.71,
          ${(props) => (props.disableInitialAnimation ? 0 : -0.29)},
          0.96,
          0.9
        ) 0s 1 normal forwards running,
      continueSpin-${({ classKey }) => classKey} ${({ continueSpinningTime }) =>
          continueSpinningTime / 1000}s linear ${({ startSpinningTime }) =>
          startSpinningTime / 1000}s 1 normal forwards running,
      stopSpin-${({ classKey }) => classKey} ${({ stopSpinningTime }) =>
          stopSpinningTime / 1000}s cubic-bezier(0, 0, 0.35, 1.02) ${({
          startSpinningTime,
          continueSpinningTime,
        }) => (startSpinningTime + continueSpinningTime) / 1000}s 1 normal forwards
        running;
  }

  @keyframes spin-${({ classKey }) => classKey} {
    from {
      transform: rotate(${(props) => props.startRotationDegrees}deg);
    }
    to {
      transform: rotate(${(props) => props.startRotationDegrees + 360}deg);
    }
  }
  @keyframes continueSpin-${({ classKey }) => classKey} {
    from {
      transform: rotate(${(props) => props.startRotationDegrees}deg);
    }
    to {
      transform: rotate(${(props) => props.startRotationDegrees + 360}deg);
    }
  }
  @keyframes stopSpin-${({ classKey }) => classKey} {
    from {
      transform: rotate(${(props) => props.startRotationDegrees}deg);
    }
    to {
      transform: rotate(${(props) => 1440 + props.finalRotationDegrees}deg);
    }
  }
`;
