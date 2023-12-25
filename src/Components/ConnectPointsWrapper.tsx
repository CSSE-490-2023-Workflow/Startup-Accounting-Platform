import React, { MutableRefObject, useRef, useState } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";

const connectPointOffset = {
    left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
    right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
    top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
    bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" }
  };
  
  
  interface Positioning {
      x: number;
      y: number;
    }


interface ConnectPointsProps {
    boxId: string;
    handler: "top" | "bottom" | "left" | "right";
    dragRef: MutableRefObject<Draggable | null>;
    boxRef: MutableRefObject<HTMLElement| null>;
  }

function ConnectPointsWrapper(props: ConnectPointsProps) {
    const ref1 = useRef<HTMLDivElement>(null);
  
    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);
    return (
      <React.Fragment>
        <div
          className="connectPoint"
          // style={connectPointStyle}
          style={{
              // position: "absolute",
              // width: 15,
              // height: 15,
              // borderRadius: "50%",
              // background: "black"
            ...{
              position: "absolute",
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "black"
            },
            ...connectPointOffset[props.handler],
            ...position
          }}
          draggable
          onMouseDown={e => e.stopPropagation()}
          onDragStart={e => {
            setBeingDragged(true);
            e.dataTransfer.setData("arrow", props.boxId);
          }}
          onDrag={e => {
            const { offsetTop, offsetLeft } = (props.boxRef.current ? props.boxRef.current : {offsetTop: 0, offsetLeft: 0});
            const { x, y }= props.dragRef.current?.state as Positioning;
            setPosition({
              position: "fixed",
              left: e.clientX - x - offsetLeft,
              top: e.clientY - y - offsetTop,
              transform: "none",
              opacity: 0
            });
          }}
          ref={ref1}
          onDragEnd={e => {
            setPosition({});
            setBeingDragged(false);
          }}
        />
        {beingDragged ? <Xarrow start={props.boxId} end={ref1} /> : null}
      </React.Fragment>
    );
  };

  export default ConnectPointsWrapper;