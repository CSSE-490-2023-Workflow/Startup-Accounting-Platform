import { useParams } from 'react-router-dom';
import Toolbar from "../../Components/Toolbar/Toolbar";
import Workspace from "../../Components/Workspace/Workspace";
import FuncBuilderMain from "../../Components/FunctionBuilder/FuncBuilderMain";
import {LoadingOverlay} from "@mantine/core";
import {useEffect, useState} from "react";
import {database} from "../../auth/firebase";

function CustomFunctionBuilder() {
    const { id } = useParams();
    const [functionData, setFunctionData] = useState<object>({})

    useEffect(() => {
        if(id) {
            database.getFunction(id).then((func: object) => {
                setFunctionData(func);
            })
        }
    }, [id]);

    if(!id) {
        return <LoadingOverlay />
    }

    return (
        <>
            <Toolbar>
                <FuncBuilderMain functionId={id}/>
            </Toolbar>
            <Workspace>
                { // @ts-ignore
                }<h6>Function data: {functionData.rawJson}</h6>
            </Workspace>
        </>
    );
}

export default CustomFunctionBuilder;
