import { useRef } from "react";
import Draggable from "react-draggable";
import DotlessConnectPointsWrapper from "../DotlessConnectPointsWrapper";
import ConnectPointsWrapper from "../ConnectPointsWrapper";

interface IProps {
    style: any;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    id: string;
    faIcon: any;
    dragRef: React.RefObject<Draggable>;
  }

function OutputDiv(props: IProps) {
    const { style, onMouseEnter, onMouseLeave, id, faIcon, dragRef } = props;
    const boxRef =  useRef<HTMLDivElement>(null);
    return(
        <div
            style={style} 
            className='connection-handle-wrapper'
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={boxRef}
        >
            <div className='connection-handle connection-handle-out' id={id}>
            {faIcon}
            </div>
            {/* <ConnectPointsWrapper boxId={id} handler={1} dragRef={dragRef} boxRef={boxRef} /> */}
            <DotlessConnectPointsWrapper boxId={id} dragRef={dragRef} boxRef={boxRef} />
        </div>
    );
}

export default OutputDiv;