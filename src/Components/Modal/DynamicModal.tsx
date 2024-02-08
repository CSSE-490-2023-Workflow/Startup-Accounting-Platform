import React from 'react';
import {Box, Button, Checkbox, Group, Modal, Select, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";

import { useState, useEffect } from 'react';
import {ModelData} from "../../auth/FirebaseRepository";

export enum ModalElementType {
    Text,
    TextBox,
    Select,
}

export interface ModalElement {
    name: string
    title: string
    type: ModalElementType
    data?: object
}

interface DynamicModalProps {
    isOpen: boolean;
    close: () => void;
    submit: (data: object) => void;
    title: string;
    elements: ModalElement[];
    values: ModelData | null;
    buttonProps?: object;
}


const DynamicModal: React.FC<DynamicModalProps> = ({isOpen, close, submit, title, elements, values, buttonProps = {}}) => {
    // Create a state variable for the form values
    const [formValues, setFormValues] = useState({ ...values });

    // Update formValues whenever a form element's value changes
    const handleValueChange = (key: string, newValue: string) => {
        // @ts-ignore
        setFormValues(prevFormValues => ({
            ...prevFormValues,
            [key]: newValue,
        }));
    };

    return (
        <Modal
            opened={isOpen}
            onClose={close}
            title={title}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Box maw={340} mx="auto">
                {elements.map((element: ModalElement) => {
                    switch (element.type) {
                        case ModalElementType.Text:
                            return (
                                <TextInput
                                    mt="md"
                                    label={element.title}
                                    // @ts-ignore
                                    value={formValues[element.name]}
                                    onChange={event => handleValueChange(element.name, event.target.value)}
                                    key={element.name}
                                />
                            );
                        case ModalElementType.Select:
                            return (
                                <Select
                                    mt="md"
                                    label={element.title}
                                    // @ts-ignore
                                    value={formValues[element.name]}
                                    // @ts-ignore
                                    data={element.data.items}
                                    // @ts-ignore
                                    onChange={value => handleValueChange(element.name, value)}
                                    key={element.name}
                                />
                            );
                    }
                })}

                <Group justify="flex-end" mt="md">
                    <Button onClick={() => {
                        submit(formValues);
                        close();
                    }} { ...buttonProps }>
                        { // @ts-ignore
                            buttonProps.text ? buttonProps.text : "Submit"
                        }
                    </Button>
                </Group>
            </Box>
        </Modal>
    );
};

export default DynamicModal;
