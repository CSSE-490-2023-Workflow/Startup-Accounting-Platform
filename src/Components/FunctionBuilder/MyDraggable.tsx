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
    const disabled = props.disabled;

    useEffect(() => {
      setArrows((arrows : any) => [...arrows])
    }, [styles])

    const dragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const boundingRect = 
        (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDiffPos({
        diffX: Math.max(0, e.pageX - (boundingRect.left + window.scrollX)),
        diffY: Math.max(0, e.pageY - (boundingRect.top + window.scrollY)),
      });
      // console.log(e.pageX + " " + e.pageY);
      // console.log(boundingRect.left + " " + boundingRect.top);
    }

    const dragEnd = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const boundingRect = 
        (e.currentTarget as HTMLElement).getBoundingClientRect();
      // console.log(e.pageX + " " + e.pageY);
      const left = Math.max(0, e.pageX - diffPos.diffX); // + boundingRect.left
      const top = Math.max(0, e.pageY - diffPos.diffY); // + boundingRect.top
      if (top > 100) {
        setStyles({ left: left, top: top });
      }
      updateLocation(id, left, top)
    }, [diffPos])

    let disabledAttr = {}
    if (disabled) {
      disabledAttr = { pointerEvents : "none"}
    } 

    return (
        <div
            style={{ ...styles, position: "absolute", ...disabledAttr}}
            onDragStart={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => dragStart(e)}
            onDragEnd={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => dragEnd(e)}
            draggable={!disabled}
            id={props.dId}
        >
          {props.children}
        </div>
    );
}
