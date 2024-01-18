import {Button, Group, Paper} from "@mantine/core";
import {IconChevronLeft} from "@tabler/icons-react";

const Toolbar = () => {
    return (
        <Group>
            <Paper shadow="sm" radius="md" withBorder p="md" m="xs" w="100%"> {/* Add this line */}
                <Group>
                    <Button leftSection={<IconChevronLeft/>}>Save & Exit</Button>
                </Group>
            </Paper>
        </Group>
    );
}

export default Toolbar;