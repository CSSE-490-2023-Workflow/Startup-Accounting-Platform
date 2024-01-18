import { Group, Paper } from "@mantine/core";
import React, {PropsWithChildren} from "react";

const Toolbar = (props: PropsWithChildren) => {
    return (
        <Paper radius="md" withBorder p="md" w="100%">
            <Group>
                { props.children }
            </Group>
        </Paper>
    );
}

export default Toolbar;