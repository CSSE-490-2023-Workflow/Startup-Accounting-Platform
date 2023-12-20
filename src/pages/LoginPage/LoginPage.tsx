import {
    Paper,
    Title,
    Text,
    Container,
} from '@mantine/core';
import classes from './LoginPage.module.css';
import {WEBSITE_NAME} from "../../constants/constants";
import {LoginButton} from "../../auth/firebase";

export function LoginPage() {
    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome to {WEBSITE_NAME}
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Please sign in with your Google account
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <LoginButton radius="xl" fullWidth>Sign in</LoginButton>
            </Paper>
        </Container>
    );
}