import {Box, Button, Group, LoadingOverlay, Modal, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import React, {useCallback, useContext, useState} from "react";
import { useForm } from '@mantine/form';
import {AuthContext, database} from "../../auth/firebase";
import {UserData} from "../../auth/FirebaseRepository";

interface ShareModalProps {
    title: string;
    opened: boolean;
    onClose: () => void;
    onSubmit: (user: UserData) => void;
}

const ShareModal = (props: ShareModalProps) => {

    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: { email: '' },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
        },
    });

    const handleSubmit = useCallback((email: string) => {

        setLoading(true);

        database.getUserForEmail(email).then((user) => {

            props.onSubmit(user);
            props.onClose();
            setLoading(false);

        }).catch(() => {

            form.setErrors({ email: "We couldn't find this user" });
            setLoading(false);

        })

    }, []);

    return (
        <Modal opened={props.opened} onClose={props.onClose} title={props.title} centered>
            <Box maw={340} mx="auto">
                <form onSubmit={form.onSubmit((values, event) => { handleSubmit(values.email) })}>
                    <TextInput
                        label="Email"
                        placeholder="user@email.com"
                        {...form.getInputProps('email')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Box pos='relative'>
                            <LoadingOverlay visible={loading} loaderProps={{size: 28}}/>
                            <Button type="submit">Share</Button>
                        </Box>
                    </Group>
                </form>
            </Box>
        </Modal>
)
}

export default ShareModal;