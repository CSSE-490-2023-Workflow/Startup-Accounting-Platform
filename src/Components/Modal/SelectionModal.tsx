import {Box, Button, Group, LoadingOverlay, Modal, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import React, {useCallback, useContext, useState} from "react";
import { useForm } from '@mantine/form';
import {AuthContext, database} from "../../auth/firebase";
import {UserData} from "../../auth/FirebaseRepository";

interface SelectionModalProps {
    title: string;
    opened: boolean;
    onClose: () => void;
    onSubmit: (option: string) => void; // Change to accept the selected option
    options: string[]; // Add options prop
}

const SelectionModal = (props: SelectionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(''); // State to manage the selected option

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        // Pass the selected option to the onSubmit function
        props.onSubmit(selectedOption);
        props.onClose();
        setLoading(false);
    }, [selectedOption]);

    return (
        <Modal opened={props.opened} onClose={props.onClose} title={props.title} centered>
            <Box maw={340} mx="auto">
                <form onSubmit={(event) => handleSubmit(event)}>
                    {/* Dropdown component */}
                    <select
                        value={selectedOption}
                        onChange={(e) => {
                            setSelectedOption(e.target.value);
                            console.log(selectedOption);
                        }}
                    >
                        <option value="">Select an option...</option>
                        {props.options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <Group justify="flex-end" mt="md">
                        <Box pos='relative'>
                            <LoadingOverlay visible={loading} loaderProps={{size: 28}}/>
                            <Button type="submit">Create</Button>
                        </Box>
                    </Group>
                </form>
            </Box>
        </Modal>
    );
};

export default SelectionModal;