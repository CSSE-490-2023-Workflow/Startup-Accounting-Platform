import {Card, Text, Image, Group, Badge, Button, ActionIcon} from "@mantine/core";
import classes from './ModelCard.module.css';
import CardPage from "../CardPage/CardPage";
import {IconTrash} from "@tabler/icons-react";

const mockdata = [
    {
        name: 'Test Model',
        description: 'This model does model things and it is very modely',
        inputs: ['Revenue', 'Expenses'],
        displayStyle: 'bar-graph'
    }
];

// @ts-ignore
const cards = mockdata.map((model) => (
    <Card withBorder radius="md" p="md" className={classes.card}>
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
            <Button radius="md" style={{ flex: 1 }}>
                Edit
            </Button>
            <ActionIcon variant="default" radius="md" size={36}>
                <IconTrash className={classes.delete} stroke={1.5} />
            </ActionIcon>
        </Group>
    </Card>
));

const Models = () => {
    return (
        <CardPage cards={cards}/>
    )
}

export default Models