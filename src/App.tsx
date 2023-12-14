import cx from 'clsx';
import {useCallback, useState} from 'react';
import {
    Container,
    Group,
    Tabs,
    Burger,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import classes from './HeaderTabs.module.css';
import LoginButton from "./Auth/firebase";
import Demo from "./Demo";


const tabs = [
    'Demo',
    'Workflows',
    'Templates',
    'Functions'
];

export function App() {
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);
    const [activeTab, setActiveTab] = useState('Demo')

    const handleTabChange = useCallback((tabName: string | null) => {
        if(!tabName)
            return;
        setActiveTab(tabName);
    }, []);

    const items = tabs.map((tab) => (
        <Tabs.Tab value={tab}>
            {tab}
        </Tabs.Tab>
    ));

    return (
        <div className={classes.header}>
            <Container className={classes.mainSection} size="md">
                <Group justify="space-between">

                    <h1>SAP</h1>

                    <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

                    <LoginButton></LoginButton>
                </Group>
            </Container>
            <Container size="md">
                <Tabs
                    defaultValue="Demo"
                    variant="outline"
                    visibleFrom="sm"
                    classNames={{
                        root: classes.tabs,
                        list: classes.tabsList,
                        tab: classes.tab,
                    }}
                    onChange={handleTabChange}
                >
                    <Tabs.List>{items}</Tabs.List>
                </Tabs>
            </Container>
            <div>
                {activeTab === 'Demo' && <Demo />}
            </div>
        </div>
    );
}