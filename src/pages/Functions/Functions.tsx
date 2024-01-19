import {useCallback, useState} from 'react';
import './Functions.css'
import FuncBuilderMain from '../../Components/FunctionBuilder/FuncBuilderMain';
import {Box, Button, LoadingOverlay, Space} from "@mantine/core";
import {database} from "../../auth/firebase";

function Functions() {
    const [loading, setLoading] = useState(false);


    const createNewFunction = () => {
        setLoading(true);

        database.createEmptyFunction().then((functionId: string) => {
            window.open(`/function/${functionId}`, '_blank');
            setLoading(false);
        });
    }

    return (
        <div className="Demo">
            <header className="App-header">
                <Box pos='relative'>
                    <LoadingOverlay visible={loading} loaderProps={{size: 28}} />
                    <Button onClick={createNewFunction}>Create New Function</Button>
                </Box>


                <Space h={'150'} />
                <h4>Func Builder for Testing</h4>
                <FuncBuilderMain functionId={"test_function"}/>
            </header>
        </div>
    );
}

export default Functions;