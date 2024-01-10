//Code adapted from: https://stackoverflow.com/questions/62408529/react-drag-drop-and-connect-arrowor-anything-else-with-animation-between-elem
import { useState } from "react";
import Xarrow from "react-xarrows";
import DraggableBox from "./DraggableBox";

interface StartAndEnd {
  start: string;
  end: string;
}

function ArrowExample() {
  const [arrows, setArrows] = useState<StartAndEnd[]>([]);
  const addArrow = (value: StartAndEnd) => {
    setArrows([...arrows, value]);
  };
  return (
    <div style={{ gap: "20px", display: "flex", justifyContent: "space-between" }}>
      {/* two boxes */}
      <DraggableBox
        text="drag my handler to second element"
        {...{ addArrow, setArrows, handler: "right", boxId: "box2_1" }}
      />
      <div></div>
      <DraggableBox
        text="second element"
        {...{ addArrow, setArrows, handler: "left", boxId: "box2_2" }}
      />
      {arrows.map(ar => (
        <Xarrow
          start={ar.start}
          end={ar.end}
          key={ar.start + "-." + ar.start}
        />
      ))}
    </div>
  );
}

export default ArrowExample;
