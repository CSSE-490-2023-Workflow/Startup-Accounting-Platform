import {
    ActionIcon,
    Button,
    Group,
    Indicator,
    Menu,
    Paper,
    ScrollArea,
    Text,
    UnstyledButton,
    Notification
} from "@mantine/core"
import {
    IconBell,
    IconCheck,
    IconX
} from "@tabler/icons-react";
import cx from "clsx";
import headerClasses from "../HomeHeader/HeaderTabs.module.css";
import React, {ReactElement, useCallback, useContext, useEffect, useState} from "react";
import {AuthContext, database} from "../../auth/firebase"
import * as firestore from 'firebase/firestore';
import Timestamp = firestore.Timestamp;
import classes from "./NotificationMenu.module.css"
import { ToastContainer, toast } from "react-toastify";

interface Notification {
    timestamp: Timestamp;
    element: ReactElement;
}

const NotificationMenu = (props: any) => {
    const [sharedFunctionsNotifications, setSharedFunctionsNotifications] = useState<Notification[]>([]);
    const [notificationMenuOpened, setNotificationMenuOpened] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState(false)
    const [alertContent, setAlertContent] = useState('alert')

    const navigate = useCallback((pHref: string) => {
        window.open(pHref)
    }, [currentUser])

    useEffect(() => {

        if(!currentUser)
            return;

        database.subscribeToSharedFunctionsForReceiver(currentUser.uid, async (sharedFunctions) => {

            const notifs = await Promise.all(sharedFunctions.map(async (sharedFunction) => {
                const fromUser = await database.getUser(sharedFunction.senderId);
                const func = await database.getFunction(sharedFunction.functionId);
                let previewCallback : () => void;
                let funcName = ""
                if (func == undefined) { //function has been removed
                    funcName = "deleted function"
                    previewCallback = () => {
                        props.setAlertCB("This function has been deleted by its owner")
                    }
                } else {
                    funcName = func.name
                    previewCallback = () => {
                        navigate(`/functionPreview/${sharedFunction.id}/${sharedFunction.functionId}`)
                    }
                }
                return {
                    timestamp: sharedFunction.time,
                    element: (
                        <Paper withBorder p="sm" className={classes.notif_element}>
                            <Group>
                                <text>{fromUser == undefined ? "cancalled user" : fromUser.fullName} sent you a function <a href='' onClick={previewCallback}>{funcName}</a></text>
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
        <>
            <button onClick={() => toast("wow")}>button</button>
            <ToastContainer />
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
                <ScrollArea h={600}>
                    { makeNotifications(unsortedNotifications) }
                </ScrollArea>
            </Menu.Dropdown>
        </Menu>
        </>
        
    )
}

export default NotificationMenu;