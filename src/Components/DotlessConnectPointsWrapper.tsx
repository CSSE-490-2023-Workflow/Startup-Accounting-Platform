import React, { MutableRefObject, useRef, useState } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";

  
  
  interface Positioning {
      x: number;
      y: number;
    }


interface IProps {
    boxId: string;
    dragRef: MutableRefObject<Draggable | null>;
    boxRef: MutableRefObject<HTMLElement| null>;
  }

function DotlessConnectPointsWrapper(props: IProps) {
    const ref1 = useRef<HTMLDivElement>(null);
  
    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);
    return (
      <React.Fragment>
        <div
          className="connectPoint"
          // style={connectPointStyle}
          style={{
              position: "absolute",
              width: 15,
              height: 15,
              // borderRadius: "50%",
              // background: "black"
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

  export default DotlessConnectPointsWrapper;