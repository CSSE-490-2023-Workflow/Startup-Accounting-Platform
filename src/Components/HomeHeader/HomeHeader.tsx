

import {
    Container,
    Group,
    Tabs,
    Burger,
    Notification
} from '@mantine/core';
import {useCallback, useState} from 'react';
import { useDisclosure } from '@mantine/hooks';

import classes from './HeaderTabs.module.css';
import {UserMenu} from "../../auth/firebase"
import Demo from "../../pages/Demo/Demo";
import {WEBSITE_NAME_ABBREV} from "../../constants/constants";
import Models from "../../pages/Models/Models";
import Functions from "../../pages/Functions/Functions";
import Workflows from "../../pages/Workflow/Workflows";
import NotificationMenu from "../NotificationMenu/NotificationMenu";
import Templates from '../../pages/Template/Templates';
import React from 'react';
import { memo } from 'react'

const tabs = [
  'Demo',
  'Models',
  'Functions',
  'Templates',
  'Workflows',
];

const HomeHeader = memo((props: any) => {
  const [opened, { toggle }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<String | null>('Demo')
  console.log('header mounted')

  const handleTabChange = useCallback((tabName: string | null) => {
      if(!tabName)
          return;
      setActiveTab(tabName);
  }, []);

  const items = tabs.map((tab) => (
      <Tabs.Tab value={tab} key={tab}>
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

                  <Group>
                      <NotificationMenu />
                      <UserMenu />
                  </Group>
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
          {activeTab === 'Templates' && <Templates/>}
          {/* {activeTab === 'FunctionBuilderTesting' && <FunctionBuilderTesting/>} */}
          {activeTab === 'Workflows' && <Workflows />}
          {/* {activeTab === 'Arrows' && <ArrowExample/>} */}
      </div>
    </div>
  )
}, (prev, next) => true)

export default HomeHeader
