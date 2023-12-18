import {useCallback, useState} from 'react';
import {
    Container,
    Group,
    Tabs,
    Burger,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import classes from './HeaderTabs.module.css';
import {UserMenu} from "./auth/firebase";
import Demo from "./pages/Demo/Demo";
import {WEBSITE_NAME_ABBREV} from "./constants/constants";
import Models from "./pages/Models/Models";
import Functions from "./pages/Functions/Functions";


const tabs = [
    'Demo',
    'Models',
    'Functions',
    'Workflows'
];

export function Home() {
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
        <div>
            <div className={classes.header}>
                <Container className={classes.mainSection} size="md">
                    <Group justify="space-between">

                        <h1>{WEBSITE_NAME_ABBREV}</h1>

                        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm"/>

                        <UserMenu></UserMenu>
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
            </div>
            <div>
                {activeTab === 'Demo' && <Demo/>}
                {activeTab === 'Models' && <Models/>}
                {activeTab === 'Functions' && <Functions/>}
            </div>
        </div>
)
    ;
}