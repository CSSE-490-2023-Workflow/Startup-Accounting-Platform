import { useParams } from 'react-router-dom';
import {Button, Group, LoadingOverlay} from "@mantine/core";
import {IconChevronLeft} from "@tabler/icons-react";
import Toolbar from "./Toolbar";
import classes from "./WorkflowBuilder.module.css"
import {useEffect, useState} from "react";
import {database} from "../../auth/firebase";

function WorkflowBuilder() {
    const { id } = useParams();
    const [workflowData, setWorkflowData] = useState<object | null>(null)

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
            <header> { // @ts-ignore
            } <Toolbar workflowName={workflowData.name} setWorkflowName={setWorkflowName}/>
            </header>
            <body className={classes.gridBackground}>
                Workflow {id // @ts-ignore
                } <br/> Name: {workflowData.name}
            </body>
        </>
    );
}

export default WorkflowBuilder;
