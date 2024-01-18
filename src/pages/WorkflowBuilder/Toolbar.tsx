import {ActionIcon, Button, Group, Paper, TextInput, Tooltip} from "@mantine/core";
import {IconChartBar, IconChevronLeft, IconLayoutGridAdd} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {useFocusWithin} from "@mantine/hooks";

interface ToolbarProps {
    workflowName: string;
    setWorkflowName: (name: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({workflowName, setWorkflowName}) => {

    const { ref: workflowNameRef, focused: workflowNameFocused } = useFocusWithin();
    const [textboxText, setTextboxText] = useState<string | null>(null);

    useEffect(() => {
        if(!workflowNameFocused && textboxText) {
            setWorkflowName(textboxText);
        }
    }, [workflowNameFocused]);

    return (
        <Paper radius="md" withBorder p="md" w="100%">
            <Group>
                <Button leftSection={<IconChevronLeft/>}>Save & Exit</Button>
                <TextInput
                    ref={workflowNameRef}
                    defaultValue={workflowName}
                    onChange={(event) => setTextboxText(event.currentTarget.value)}/>
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
            </Group>
        </Paper>
    );
}

export default Toolbar;