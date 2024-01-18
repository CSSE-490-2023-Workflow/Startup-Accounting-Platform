import { useParams } from 'react-router-dom';
import {Button, Group} from "@mantine/core";
import {IconChevronLeft} from "@tabler/icons-react";
import Toolbar from "./Toolbar";

function WorkflowBuilder() {
    const { id } = useParams();

    // Use the id to fetch and display the appropriate workflow.
    // This is just a placeholder and will depend on your actual implementation.
    return (
        <div>
            <Toolbar/>
            <h1>Workflow {id}</h1>
            {/* Display the workflow here */}
        </div>
    );
}

export default WorkflowBuilder;
