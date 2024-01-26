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
    const [originalPosition, setOriginalPosition] = useState<Positioning>({x: 0, y: 0});
    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);
    return (
      <React.Fragment>
        <div
          className="connectPoint"
          // style={connectPointStyle}
          style={{
              position: "absolute", top: 0, left: 0,
              width: 20,
              height: 15,
              translate: (-10),
              // borderRadius: "50%",
              // background: "black"
            ...position
          }}
          draggable
          onMouseDown={e => e.stopPropagation()}
          onDragStart={e => {
            setBeingDragged(true);
            e.dataTransfer.setData("arrow", props.boxId);
            console.log(e.clientX + " " + e.clientY);
            setOriginalPosition({x: e.clientX, y: e.clientY})
          }}
          onDrag={e => {
            const { offsetTop, offsetLeft } = (props.boxRef.current ? props.boxRef.current : {offsetTop: 0, offsetLeft: 0});
            // const { x, y }= props.dragRef.current?.state as Positioning;
            // console.log(e.clientX + " " + x + " " + offsetLeft);
            setPosition({
              position: "relative",
              left: e.clientX - offsetLeft - originalPosition.x,
              top: e.clientY - offsetTop - originalPosition.y,
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