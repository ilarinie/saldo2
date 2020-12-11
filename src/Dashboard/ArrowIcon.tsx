import * as React from "react";

export const ArrowStatusIcon = ({
  up,
  color,
  style,
  radius = "26px",
}: {
  up: boolean | undefined;
  color: string;
  style?: React.CSSProperties;
  radius?: string;
}) => {
  return (
    <svg
      style={style}
      viewBox="-50 -50 100 100"
      height={radius}
      width={radius}
    >
      <circle x={0} y={0} r={50} fill={color} />
      <UpPath />
      <ArrowPath up={up} />
    </svg>
  );
};

const UpPath = () => (
  <path stroke="#fff" d="M 0,25 L 0,-25" strokeWidth="5px" fillOpacity={0} />
);
const ArrowPath = ({ up }: { up: boolean | undefined }) => {
  return (
    <>
      {up && (
        <>
          <path
            stroke="#fff"
            d="M -1,-25 L 25,0"
            strokeWidth="5px"
            fillOpacity={0}
          />
          <path
            stroke="#fff"
            d="M 1,-25 L -25,0"
            strokeWidth="5px"
            fillOpacity={0}
          />
        </>
      )}
      {!up && (
        <>
          <path
            stroke="#fff"
            d="M -1,25 L 25,0"
            strokeWidth="5px"
            fillOpacity={0}
          />
          <path
            stroke="#fff"
            d="M 1,25 L -25,0"
            strokeWidth="5px"
            fillOpacity={0}
          />
        </>
      )}
    </>
  );
};
