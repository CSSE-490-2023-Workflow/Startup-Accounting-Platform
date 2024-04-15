import { useParams } from 'react-router-dom';
import Toolbar from "../../Components/Toolbar/Toolbar";
import Workspace from "../../Components/Workspace/Workspace";
import FuncBuilderMain from "../../Components/FunctionBuilder/FuncBuilderMain";
import {LoadingOverlay, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {database} from "../../auth/firebase";
import {FunctionData} from "../../auth/FirebaseRepository";
import {useFocusWithin} from "@mantine/hooks";

function CustomFunctionBuilder() {
    const { id } = useParams();
    const [functionData, setFunctionData] = useState<FunctionData>();
    const {ref: functionNameRef, focused: functionNameInputFocused} = useFocusWithin();
    const [functionNameInputText, setFunctionNameInputText] = useState<string | null>(null);

    useEffect(() => {
        if(id) {
            database.subscribeToFunction(id, (functionDataFromDB: FunctionData) => {
               setFunctionData(functionDataFromDB);
            });
        }
    }, [id]);

    useEffect(() => {
        if(!functionNameInputFocused && functionNameInputText && functionData) {
            database.updateFunction(functionData.id, { name: functionNameInputText });
        }
    }, [functionNameInputFocused]);

    if(!id || !functionData) {
        return <LoadingOverlay />
    }

    return (
        <>
            <Toolbar>
                <TextInput ref={functionNameRef}
                           defaultValue={functionData.name}
                           onChange={(event) => setFunctionNameInputText(event.currentTarget.value)}
                           style={{width: '20%'}}
                />
                <div style={{width: '100%'}}></div>
                <FuncBuilderMain functionId={id} functionRawJson={functionData.rawJson} />
            </Toolbar>
            <Workspace>
                {/*<h6>Function data: {functionData.rawJson}</h6>*/}
            </Workspace>
        </>
    );
}

export default CustomFunctionBuilder;
