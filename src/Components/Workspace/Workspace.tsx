import {PropsWithChildren} from "react";
import classes from "./Workspace.module.css"

const Workspace = (props: PropsWithChildren) => {
    return (
        <div className={classes.gridBackground}>
            { props.children }
        </div>
    );
}

export default Workspace;