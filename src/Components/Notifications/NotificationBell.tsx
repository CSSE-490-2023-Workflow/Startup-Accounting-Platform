import {ActionIcon, Avatar, Button, Group, Menu, rem, Text, UnstyledButton} from "@mantine/core"
import {IconArrowsLeftRight, IconBell, IconChevronDown, IconTrash} from "@tabler/icons-react";
import cx from "clsx";
import classes from "../../HeaderTabs.module.css";
import React from "react";

const NotificationBell = () => {
    return (
        <Menu             width={260}
                          position="bottom-end"
                          transitionProps={{transition: 'pop-top-right'}}
                          withinPortal>
            <Menu.Target>
                <ActionIcon variant={"default"}>
                    <IconBell />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <div>
                    <button>test</button>
                </div>
            </Menu.Dropdown>
        </Menu>
    )
}

export default NotificationBell;