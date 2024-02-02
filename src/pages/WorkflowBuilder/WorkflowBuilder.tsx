import { useParams } from 'react-router-dom';
import {ActionIcon, Button, Group, LoadingOverlay, TextInput, Tooltip} from "@mantine/core";
import {IconChartBar, IconChevronLeft, IconLayoutGridAdd} from "@tabler/icons-react";
import Toolbar from "../../Components/Toolbar/Toolbar";
import React, {useEffect, useState} from "react";
import {database} from "../../auth/firebase";
import {useFocusWithin} from "@mantine/hooks";
import Workspace from "../../Components/Workspace/Workspace";
import {WorkflowData} from "../Workflow/Workflows";

const WorkflowBuilder = () => {
    const { id } = useParams();
    const [workflowData, setWorkflowData] = useState<WorkflowData>();
    const {ref: workflowNameRef, focused: workflowNameInputFocused} = useFocusWithin();
    const [workflowNameInputText, setWorkflowNameInputText] = useState<string | null>(null);

    useEffect(() => {
        if(id) {
            database.subscribeToWorkflow(id, (workflowDataFromDB: WorkflowData) => {
                setWorkflowData(workflowDataFromDB);
            });
        }
    }, [id]);

    useEffect(() => {
        if(!workflowNameInputFocused && workflowNameInputText && workflowData) {
            database.updateWorkflow(workflowData.id, { name: workflowNameInputText });
        }
    }, [workflowNameInputFocused]);

    if(!id || !workflowData) {
        return <LoadingOverlay />
    }

    return (
        <>
            <Toolbar>
                <Button leftSection={<IconChevronLeft/>}>Save & Exit</Button>
                { /* @ts-ignore */ }
                <TextInput ref={workflowNameRef} defaultValue={workflowData.name}
                    onChange={(event) => setWorkflowNameInputText(event.currentTarget.value)}/>
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
            <Workspace>
            </Workspace>
        </>
    );
}

export default WorkflowBuilder;
