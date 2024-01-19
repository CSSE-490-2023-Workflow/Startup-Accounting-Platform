import { useParams } from 'react-router-dom';
import Toolbar from "../../Components/Toolbar/Toolbar";
import Workspace from "../../Components/Workspace/Workspace";
import FuncBuilderMain from "../../Components/FunctionBuilder/FuncBuilderMain";
import {LoadingOverlay} from "@mantine/core";

function CustomFunctionBuilder() {
    const { id } = useParams();

    if(!id) {
        return <LoadingOverlay />
    }

    return (
        <>
            <Toolbar>
                <FuncBuilderMain functionId={id}/>
            </Toolbar>
            <Workspace />
        </>
    );
}

export default CustomFunctionBuilder;
