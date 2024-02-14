import { Notification } from "@mantine/core";
import { useEffect, useState } from "react";

export function Alert(props: any) {
  const [alertContent, setAlertContent] = useState('')
  return  (
    <>
      <Notification title={props.alertContent}></Notification>
    </>
  )
}