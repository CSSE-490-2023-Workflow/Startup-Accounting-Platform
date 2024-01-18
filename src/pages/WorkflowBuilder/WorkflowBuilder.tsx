import { useParams } from 'react-router-dom';
import {ActionIcon, Button, Group, LoadingOverlay, TextInput, Tooltip} from "@mantine/core";
import {IconChartBar, IconChevronLeft, IconLayoutGridAdd} from "@tabler/icons-react";
import Toolbar from "../../Components/Toolbar/Toolbar";
import React, {useEffect, useState} from "react";
import {database} from "../../auth/firebase";
import {useFocusWithin} from "@mantine/hooks";
import Workspace from "../../Components/Workspace/Workspace";

function WorkflowBuilder() {
    const { id } = useParams();
    const [workflowData, setWorkflowData] = useState<object | null>(null)
    const { ref: workflowNameRef, focused: workflowNameFocused } = useFocusWithin();
    const [textboxText, setTextboxText] = useState<string | null>(null);

    useEffect(() => {
        if(!workflowNameFocused && textboxText) {
            setWorkflowName(textboxText);
        }
    }, [workflowNameFocused]);

    useEffect(() => {
        console.log(workflowData);
    }, [workflowData]);

    useEffect(() => {
        if(id) {
            database.getWorkflow(id).then((workflow) => {
                setWorkflowData(workflow);
            });
        }
    }, [id])

    const setWorkflowName = (name: string) => {
        const workflowDataCopy = { ...workflowData };
        // @ts-ignore
        workflowDataCopy.name = name;
        setWorkflowData(workflowDataCopy);
    }

    if(!workflowData) {
        return <LoadingOverlay visible={true} />
    }

    return (
        <>
            <header>
                <Toolbar>
                    <Button leftSection={<IconChevronLeft/>}>Save & Exit</Button>
                    { /* @ts-ignore */ }
                    <TextInput ref={workflowNameRef} defaultValue={workflowData.name}
                        onChange={(event) => setTextboxText(event.currentTarget.value)}/>
                    <Tooltip label="Add function">
                        <ActionIcon size={'lg'} variant={'default'}>
                            <IconLayoutGridAdd />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Add model">
                        <ActionIcon size={'lg'} variant={'default'}>
                            <IconChartBar />
                        </ActionIcon>
                    </Tooltip>
                </Toolbar>
            </header>
            <Workspace>
                Workflow {id // @ts-ignore
                } <br/> Name: {workflowData.name}
            </Workspace>
        </>
    );
}

export default WorkflowBuilder;
