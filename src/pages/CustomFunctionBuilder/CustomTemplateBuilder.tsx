import { useParams } from 'react-router-dom';
import Toolbar from "../../Components/Toolbar/Toolbar";
import Workspace from "../../Components/Workspace/Workspace";
import FuncBuilderMain from "../../Components/FunctionBuilder/FuncBuilderMain";
import {LoadingOverlay, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {database} from "../../auth/firebase";
import {useFocusWithin} from "@mantine/hooks";
import { TemplateData } from '../Template/Templates';

function CustomTemplateBuilder() {
    const { id } = useParams();
    const [templateData, setTemplateData] = useState<TemplateData>();
    const {ref: templateNameRef, focused: templateNameInputFocused} = useFocusWithin();
    const [templateNameInputText, setTemplateNameInputText] = useState<string | null>(null);

    useEffect(() => {
        if(id) {
            database.subscribeToTemplate(id, (templateDataFromDB: TemplateData) => {
               setTemplateData(templateDataFromDB);
            });
        }
    }, [id]);

    useEffect(() => {
        if(!templateNameInputFocused && templateNameInputText && templateData) {
            database.updateTemplate(templateData.id, { name: templateNameInputText });
        }
    }, [templateNameInputFocused]);

    if(!id || !templateData) {
        return <LoadingOverlay />
    }

    return (
        <>
            <Toolbar>
                <TextInput ref={templateNameRef}
                           defaultValue={templateData.name}
                           onChange={(event) => setTemplateNameInputText(event.currentTarget.value)}/>
                <FuncBuilderMain template={true} functionId={id} functionRawJson={templateData.rawJson} />
            </Toolbar>
            <Workspace>
                {/*<h6>Function data: {functionData.rawJson}</h6>*/}
            </Workspace>
        </>
    );
}

export default CustomTemplateBuilder;
