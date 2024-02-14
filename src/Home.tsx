import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from './Components/Alert/Alert'
import HomeHeader from './Components/HomeHeader/HomeHeader';
import { memo } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



export function Home() {
    const [alertContent, setAlertContent] = useState('')
    const [tmp, setTmp] = useState('')
    //const [alertComp, setAlertComp] = useState(<></>)

    //console.log('home is mounted')

    const showAlert = (msg: string) => {
        console.log('wow')
        toast(msg)
    }

    const alertComp = alertContent == "" ? <></> : <Alert alertContent={alertContent} />

    return (
        <>
            <ToastContainer />
            <HomeHeader setAlertCB={showAlert} />
        </>
    )
}