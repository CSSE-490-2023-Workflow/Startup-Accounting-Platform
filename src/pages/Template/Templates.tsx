import React, {useCallback, useContext, useEffect, useState} from 'react';
import FuncBuilderMain from '../../Components/FunctionBuilder/FuncBuilderMain';
import {ActionIcon, Box, Button, Card, Center, Group, LoadingOverlay, Space, Text} from "@mantine/core";
import {AuthContext, database} from "../../auth/firebase";
import CardPage from "../CardPage/CardPage";
import DynamicModal from "../../Components/Modal/DynamicModal";
import {IconTrash} from "@tabler/icons-react";
import classes from "../Models/ModelCard.module.css";
import {useDisclosure} from "@mantine/hooks";

export interface TemplateData {
    id: string;
    ownerUid: string;
    name: string;
    rawJson: string;
}

function Templates() {
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState<TemplateData[]>([]);
    const [selectedTemplates, setSelectedTemplate] = useState<TemplateData | null>(null);
    const [isDeleteOpen, {open: openDelete, close: closeDelete}] = useDisclosure(false);
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        if(currentUser) {
            database.subscribeToTemplatesForUser(currentUser.uid, templatesFromDb => {
                setTemplates(templatesFromDb);
            });
        }
    }, [currentUser]);

    const openTemplatePage = (templateId: string) => {
        window.open(`/template/${templateId}`, '_blank');
    }

    const editTemplatePage = (templateId: string, json: string) => {
        window.open(`/template/${templateId}`, '_blank');
        console.log(json);
    }

    const createNewTemplate = () => {

        if(!currentUser) {
            return;
        }

        setLoading(true);

        database.createEmptyTemplate(currentUser.uid).then((templateId: string) => {
            openTemplatePage(templateId);
            setLoading(false);
        });

    }

    const makeCards = useCallback((templatesData: TemplateData[]) => {
        return (
            templatesData.map((templateData) => {
                return (
                    <Card padding="lg" radius="md" withBorder>

                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>{templateData.name}</Text>
                            <Text fw={500} c='dimmed'>{templateData.id}</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            {templateData.rawJson}
                        </Text>

                        <Group mt='xs'>
                        <Button radius="md" style={{flex: 1}} onClick={() => {
                                console.log("the function being edited is ", database.getTemplate(templateData.id).then((result) => {
                                    // Handle the resolved value (result) here
                                    editTemplatePage(templateData.id, result.rawJson);
                                  
                                  }).catch((error) => {
                                    // Handle any errors that occur during the promise
                                    console.error("Error:", error);
                                  }));
                                }}>
                                Edit
                            </Button>
                            <ActionIcon variant="default" radius="md" size={36} onClick={() => { setSelectedTemplate(templateData); openDelete(); }}>
                                <IconTrash className={classes.delete} stroke={1.5}/>
                            </ActionIcon>
                        </Group>
                    </Card>
                )
            })
        )
    }, [templates]);

    const handleClose = () => {
        closeDelete();
        setSelectedTemplate(null);
    }

    const handleDeleteTemplate = (func: TemplateData | null) => {
        if(func)
            database.deleteFunction(func.id);
    }

    return (
        <>
            <CardPage cards={makeCards(templates)}/>
            <Center>
                <Box pos='relative'>
                    <LoadingOverlay visible={loading} loaderProps={{size: 28}}/>
                    <Button onClick={createNewTemplate}>Create New Function</Button>
                </Box>
            </Center>
            <DynamicModal isOpen={isDeleteOpen}
                          close={handleClose}
                          submit={ () => { handleDeleteTemplate(selectedTemplates) }}
                          title={"Are you sure you want to delete this function?"}
                          elements={[]}
                          values={null}
                          buttonProps={ { color: "red", text: "Delete" }} />
        </>
    );
}

export default Templates;