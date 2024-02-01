import { useState } from "react";

export { MyDraggable };

function MyDraggable (props: any) {
    const [styles, setStyles] = useState({});
    const [diffPos, setDiffPos] = useState({ diffX: 0, diffY: 0 });
    // const [isDragging, setIsDragging] = useState(false);

    const dragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      console.log(props.draggable);
      // if (!props.draggable) {
      //   return
      // }
      const boundingRect =
          (e.currentTarget as HTMLElement).getBoundingClientRect();

      setDiffPos({
          diffX: e.screenX - boundingRect.left,
          diffY: e.screenY - boundingRect.top,
      });

    }

    const dragEnd = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // if (!props.draggable) {
      //   return
      // }
        const left = e.screenX - diffPos.diffX;
        const top = e.screenY - diffPos.diffY;
        console.log('top', top)
        if (top > 100) {
          setStyles({ left: left, top: top });
        }
    }

    return (
        <div
            style={{ ...styles, position: "absolute" }}
            onDragStart={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => dragStart(e)}
            onDragEnd={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => dragEnd(e)}
            draggable={true}
            id={props.dId}
        >
          {props.children}
        </div>
    );
}