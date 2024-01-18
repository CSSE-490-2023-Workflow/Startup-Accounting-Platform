import { useParams } from 'react-router-dom';
import Toolbar from "../../Components/Toolbar/Toolbar";
import Workspace from "../../Components/Workspace/Workspace";

function CustomFunctionBuilder() {
    const { id } = useParams();

    return (
        <>
            <header>
                <Toolbar>
                </Toolbar>
            </header>
            <Workspace>
            </Workspace>
        </>
    );
}

export default CustomFunctionBuilder;
