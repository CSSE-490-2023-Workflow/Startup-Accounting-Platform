import {
    ActionIcon,
    Button,
    Group,
    Indicator,
    Menu,
    Paper,
    ScrollArea,
    Text,
    UnstyledButton
} from "@mantine/core"
import {
    IconBell,
    IconCheck,
    IconX
} from "@tabler/icons-react";
import cx from "clsx";
import headerClasses from "../../HeaderTabs.module.css";
import React, {ReactElement, useCallback, useContext, useEffect, useState} from "react";
import {AuthContext, database} from "../../auth/firebase"
import * as firestore from 'firebase/firestore';
import Timestamp = firestore.Timestamp;
import classes from "./NotificationMenu.module.css"

interface Notification {
    timestamp: Timestamp;
    element: ReactElement;
}

const NotificationMenu = () => {
    const [sharedFunctionsNotifications, setSharedFunctionsNotifications] = useState<Notification[]>([]);
    const [notificationMenuOpened, setNotificationMenuOpened] = useState(false);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {

        if(!currentUser)
            return;

        database.subscribeToSharedFunctionsForReceiver(currentUser.uid, async (sharedFunctions) => {

            const notifs = await Promise.all(sharedFunctions.map(async (sharedFunction) => {
                const fromUser = await database.getUser(sharedFunction.senderId);
                const func = await database.getFunction(sharedFunction.functionId);
                return {
                    timestamp: sharedFunction.time,
                    element: (
                        <Paper withBorder p="sm" className={classes.notif_element}>
                            <Group>
                                <Text size={"sm"}>{fromUser.fullName} sent you a function "{func.name}"</Text>
                                <Group ml={"auto"}>
                                    <Button leftSection={<IconCheck size={16}/>} size={"xs"} onClick={() => {
                                        database.createTemplateFromFunction(currentUser.uid, sharedFunction.functionId);
                                        database.deleteSharedFunctionMsg(sharedFunction.id);
                                    }}>
                                        Accept
                                    </Button>
                                    <ActionIcon variant={"default"} onClick={() => database.deleteSharedFunctionMsg(sharedFunction.id)}>
                                        <IconX size={20}/>
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Paper>
                    )
                }
            }));

            setSharedFunctionsNotifications(notifs);

        })

    }, [currentUser]);


    const makeNotifications = useCallback((notifications: Notification[]) => {

        notifications.sort((a, b) => {
            return b.timestamp.seconds - a.timestamp.seconds;
        });

        return notifications.map(notif => notif.element);

    }, []);


    const unsortedNotifications = sharedFunctionsNotifications;

    return (
        <Menu width={400}
              transitionProps={{transition: 'scale-y'}}
              withinPortal
              onClose={() => setNotificationMenuOpened(false)}
              onOpen={() => setNotificationMenuOpened(true)}>
            <Menu.Target>
                <UnstyledButton className={cx(headerClasses.user, {[headerClasses.userActive]: notificationMenuOpened})}>
                    <Indicator color="red" disabled={!unsortedNotifications.length}>
                        <Group gap={7}>
                            <IconBell size={20}/>
                        </Group>
                    </Indicator>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <ScrollArea style={{maxHeight: 600}}>
                    { makeNotifications(unsortedNotifications) }
                </ScrollArea>
            </Menu.Dropdown>
        </Menu>
    )
}

export default NotificationMenu;