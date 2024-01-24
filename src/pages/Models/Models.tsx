import {ActionIcon, Badge, Button, Card, Group, Image, Text} from "@mantine/core";
import classes from './ModelCard.module.css';
import CardPage from "../CardPage/CardPage";
import {IconTrash} from "@tabler/icons-react";
import DynamicModal, {ModalElement, ModalElementType} from "../../Components/Modal/DynamicModal";
import {useDisclosure} from "@mantine/hooks";
import React, {useEffect, useState} from "react";
import {database} from "../../auth/firebase";


export interface ModelData {
    id: string;
    name: string;
    description: string;
    inputs: string[];
    displayStyle: string;
}

let elements: ModalElement[] = [
    {
        name: "name",
        title: "Name",
        type: ModalElementType.Text,
    },
    {
        name: "description",
        title: "Description",
        type: ModalElementType.Text,
    },
    {
        name: "displayStyle",
        title: "Display Style",
        type: ModalElementType.Text
    },
    {
        name: "hello",
        title: "Inputs",
        type: ModalElementType.Select,
        data: {items: ['Revenue', 'Expenses']}
    }
];

const Models = () => {
    const [models, setModels] = useState<ModelData[]>([]);
    const [currentModel, setCurrentModel] = useState<ModelData | null>(null);
    const [isEditOpen, {open: openEdit, close: closeEdit}] = useDisclosure(false);
    const [isDeleteOpen, {open: openDelete, close: closeDelete}] = useDisclosure(false);


    useEffect(() => {
        const fetchModels = async () => {
            const data = await database.getModels();
            setModels(data);
        };
        fetchModels();
    }, []);

    const makeCards = (models: ModelData[]) => {
        return models.map((model: ModelData) => {
            return (
                <Card withBorder radius="md" p="md" className={classes.card} key={model.id}>
                    <Card.Section>
                        <Image src="https://cdn-icons-png.flaticon.com/512/8660/8660747.png" height={180} fit="contain"/>
                    </Card.Section>

                    <Card.Section className={classes.section} mt="md">
                        <Group justify="apart">
                            <Text fz="lg" fw={500}>
                                {model.name}
                            </Text>
                            <Badge size="sm" variant="light">
                                {model.displayStyle}
                            </Badge>
                        </Group>
                        <Text fz="sm" mt="xs">
                            {model.description}
                        </Text>
                    </Card.Section>

                    <Card.Section className={classes.section}>
                        <Text mt="md" className={classes.label} c="dimmed">
                            Inputs
                        </Text>
                        <Group gap={7} mt={5}>
                            {model.inputs.map(input => {
                                return (
                                    <Badge variant="light" key={input}>
                                        {input}
                                    </Badge>
                                )
                            })}
                        </Group>
                    </Card.Section>

                    <Group mt="xs">
                        <Button radius="md" style={{flex: 1}} onClick={() =>  { setCurrentModel(model); openEdit(); }}>
                            Edit
                        </Button>
                        <ActionIcon variant="default" radius="md" size={36} onClick={() => { setCurrentModel(model); openDelete(); }}>
                            <IconTrash className={classes.delete} stroke={1.5}/>
                        </ActionIcon>
                    </Group>
                </Card>
            )
        })
    }

    const handleDeleteModel = (model: ModelData | null) => {
        if(!model) return;

        database.deleteModel(model);
        const modelsCopy = [ ... models ];
        for(let i = 0; i < modelsCopy.length; i++) {
            if(modelsCopy[i].id == model.id) {
                delete modelsCopy[i];
                setModels(modelsCopy);
                return;
            }
        }
    }

    const updateData = (data: object) => {
        const modelsCopy = [ ... models ];
        for(let i = 0; i < modelsCopy.length; i++) {
            if(modelsCopy[i].id == currentModel?.id) {
                modelsCopy[i] = data as ModelData;
                database.updateModel(modelsCopy[i]);
            }
        }
        setModels(modelsCopy);
    }

    const handleClose = () => {
        closeEdit();
        closeDelete();
        setCurrentModel(null);
    }

    return (
        <>
            {currentModel && <DynamicModal isOpen={isEditOpen} close={handleClose} submit={updateData} title={"Edit Model"} elements={elements}
                                           values={currentModel}></DynamicModal> }
            <DynamicModal isOpen={isDeleteOpen} close={handleClose} submit={ () => { handleDeleteModel(currentModel) }} title={"Are you sure you want to delete this model?"} elements={[]} values={null} buttonProps={ { color: "red", text: "Delete" }} />
            <CardPage cards={makeCards(models)} />
        </>
    )
}

export default Models