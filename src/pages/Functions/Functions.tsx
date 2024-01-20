import React, {useCallback, useContext, useEffect, useState} from 'react';
import FuncBuilderMain from '../../Components/FunctionBuilder/FuncBuilderMain';
import {ActionIcon, Box, Button, Card, Center, Group, LoadingOverlay, Space, Text} from "@mantine/core";
import {AuthContext, database} from "../../auth/firebase";
import CardPage from "../CardPage/CardPage";
import DynamicModal from "../../Components/Modal/DynamicModal";
import {IconTrash} from "@tabler/icons-react";
import classes from "../Models/ModelCard.module.css";
import {useDisclosure} from "@mantine/hooks";

export interface FunctionData {
    id: string;
    ownerUid: string;
    name: string;
    rawJson: string;
}

function Functions() {
    const [loading, setLoading] = useState(false);
    const [functions, setFunctions] = useState<FunctionData[]>([]);
    const [selectedFunction, setSelectedFunction] = useState<FunctionData | null>(null);
    const [isDeleteOpen, {open: openDelete, close: closeDelete}] = useDisclosure(false);
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        if(currentUser) {
            database.subscribeToFunctionsForUser(currentUser.uid, functionsFromDb => {
                setFunctions(functionsFromDb);
            });
        }
    }, [currentUser]);

    const openFunctionPage = (functionId: string) => {
        window.open(`/function/${functionId}`, '_blank');
    }

    const createNewFunction = () => {

        if(!currentUser) {
            return;
        }

        setLoading(true);

        database.createEmptyFunction(currentUser.uid).then((functionId: string) => {
            openFunctionPage(functionId);
            setLoading(false);
        });

    }

    const makeCards = useCallback((functionsData: FunctionData[]) => {
        return (
            functionsData.map((functionData) => {
                return (
                    <Card padding="lg" radius="md" withBorder>

                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>{functionData.name}</Text>
                            <Text fw={500} c='dimmed'>{functionData.id}</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            {functionData.rawJson}
                        </Text>

                        <Group mt='xs'>
                            <Button radius="md" style={{flex: 1}} onClick={() => openFunctionPage(functionData.id)}>
                                Edit
                            </Button>
                            <ActionIcon variant="default" radius="md" size={36} onClick={() => { setSelectedFunction(functionData); openDelete(); }}>
                                <IconTrash className={classes.delete} stroke={1.5}/>
                            </ActionIcon>
                        </Group>
                    </Card>
                )
            })
        )
    }, [functions]);

    const handleClose = () => {
        closeDelete();
        setSelectedFunction(null);
    }

    const handleDeleteFunction = (func: FunctionData | null) => {
        if(func)
            database.deleteFunction(func.id);
    }

    return (
        <>
            <CardPage cards={makeCards(functions)}/>
            <Center>
                <Box pos='relative'>
                    <LoadingOverlay visible={loading} loaderProps={{size: 28}}/>
                    <Button onClick={createNewFunction}>Create New Function</Button>
                </Box>
            </Center>
            <DynamicModal isOpen={isDeleteOpen}
                          close={handleClose}
                          submit={ () => { handleDeleteFunction(selectedFunction) }}
                          title={"Are you sure you want to delete this function?"}
                          elements={[]}
                          values={null}
                          buttonProps={ { color: "red", text: "Delete" }} />
        </>
    );
}

export default Functions;