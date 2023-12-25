import React, {  useRef } from "react";
import Draggable from "react-draggable";
import ConnectPointsWrapper from "./ConnectPointsWrapper";

interface StartAndEnd {
    start: string;
    end: string;
  }

interface BoxProps {
    text: string;
    handler: "top" | "bottom" | "left" | "right";
    addArrow: (value: StartAndEnd) => void;
    setArrows: React.Dispatch<React.SetStateAction<StartAndEnd[]>>;
    boxId: string;
  }

function DraggableBox(props: BoxProps) {
  const dragRef = useRef<Draggable>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      ref={dragRef}
      onDrag={e => {
        // console.log(e);
        props.setArrows((arrows) => [...arrows]);
      }}
    >
      <div
        id={props.boxId}
        ref={boxRef}
        style={{
            border: "1px solid black",
            position: "relative",
            padding: "20px 10px"
          }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          if (e.dataTransfer.getData("arrow") === props.boxId) {
            console.log(e.dataTransfer.getData("arrow"), props.boxId);
          } else {
            const refs = { start: e.dataTransfer.getData("arrow"), end: props.boxId };
            props.addArrow(refs);
            console.log("droped!", refs);
          }
        }}
      >
        {props.text}
        <ConnectPointsWrapper boxId={props.boxId} handler={props.handler} dragRef={dragRef} boxRef={boxRef} />
      </div>
    </Draggable>
  );
};

export default DraggableBox;