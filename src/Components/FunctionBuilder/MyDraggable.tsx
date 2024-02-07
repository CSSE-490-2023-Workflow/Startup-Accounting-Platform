import { IconSeparatorVertical } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

export { MyDraggable };

/**
 * Credits: https://stackoverflow.com/questions/63862794/custom-draggable-component-too-slow-in-reactjs-when-using-onmousemove
 * HoldOffHunger, joe
 */


function MyDraggable (props: any) {
    const [styles, setStyles] = useState({left: props.left, top: props.top});
    const [diffPos, setDiffPos] = useState({ diffX: 0, diffY: 0 });
    //const [isDragging, setIsDragging] = useState(false);
    const updateLocation = props.updateLocationCB;
    const id = props.id;
    const setArrows = props.setArrows;

    useEffect(() => {
      setArrows((arrows : any) => [...arrows])
    }, [styles])

    const dragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const boundingRect = 
        (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDiffPos({
        diffX: e.screenX - boundingRect.left,
        diffY: e.screenY - boundingRect.top,
      });
    }

    const dragEnd = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const left = e.screenX - diffPos.diffX;
      const top = e.screenY - diffPos.diffY;
      if (top > 100) {
        setStyles({ left: left, top: top });
      }
      updateLocation(id, left, top)
    }, [diffPos])

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
