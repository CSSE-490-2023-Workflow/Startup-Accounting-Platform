import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ActionIcon, Box, Button, Card, Center, Group, LoadingOverlay, Space, Text} from "@mantine/core";
import {AuthContext, database} from "../../auth/firebase";
import CardPage from "../CardPage/CardPage";
import DynamicModal from "../../Components/Modal/DynamicModal";
import {IconTrash} from "@tabler/icons-react";
import classes from "../Models/ModelCard.module.css";
import {useDisclosure} from "@mantine/hooks";

export interface WorkflowData {
    id: string;
    ownerUid: string;
    name: string;
}

const Workflows = () => {
    const [loading, setLoading] = useState(false);
    const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowData | null>(null);
    const [isDeleteOpen, {open: openDelete, close: closeDelete}] = useDisclosure(false);
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        if(currentUser) {
            database.subscribeToWorkflowsForUser(currentUser.uid, workflowsFromDb => {
                setWorkflows(workflowsFromDb);
            });
        }
    }, [currentUser]);

    const openWorkflowPage = (workflowId: string) => {
        window.open(`/workflow/${workflowId}`, '_blank');
    }

    const createNewWorkflow = () => {

        if(!currentUser) {
            return;
        }

        setLoading(true);

        database.createEmptyWorkflow(currentUser.uid).then((workflowId: string) => {
            openWorkflowPage(workflowId);
            setLoading(false);
        });

    }

    const makeCards = useCallback((workflowsData: WorkflowData[]) => {
        return (
            workflowsData.map((workflowData) => {
                return (
                    <Card padding="lg" radius="md" withBorder>

                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>{workflowData.name}</Text>
                            <Text fw={500} c='dimmed'>{workflowData.id}</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            Placeholder
                        </Text>

                        <Group mt='xs'>
                        <Button radius="md" style={{flex: 1}} onClick={() => { openWorkflowPage(workflowData.id) }}>
                                Edit
                            </Button>
                            <ActionIcon variant="default" radius="md" size={36} onClick={() => { setSelectedWorkflow(workflowData); openDelete(); }}>
                                <IconTrash className={classes.delete} stroke={1.5}/>
                            </ActionIcon>
                        </Group>
                    </Card>
                )
            })
        )
    }, [workflows]);

    const handleClose = () => {
        closeDelete();
        setSelectedWorkflow(null);
    }

    const handleDeleteWorkflow = (workflow: WorkflowData | null) => {
        if(workflow)
            database.deleteWorkflow(workflow.id);
    }

    return (
        <>
            <CardPage cards={makeCards(workflows)}/>
            <Center>
                <Box pos='relative'>
                    <LoadingOverlay visible={loading} loaderProps={{size: 28}}/>
                    <Button onClick={createNewWorkflow}>Create New Workflow</Button>
                </Box>
            </Center>
            <DynamicModal isOpen={isDeleteOpen}
                          close={handleClose}
                          submit={ () => { handleDeleteWorkflow(selectedWorkflow) }}
                          title={"Are you sure you want to delete this workflow?"}
                          elements={[]}
                          values={null}
                          buttonProps={ { color: "red", text: "Delete" }} />
        </>
    );
}

export default Workflows;