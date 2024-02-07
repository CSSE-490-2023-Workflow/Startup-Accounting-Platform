import FuncBuilderMain from "../../Components/FunctionBuilder/FuncBuilderMain";
import './Functions.css'


export const FunctionBuilderTesting = () => {
    return (
        <div className="Demo">
            <header className="App-header">
                <FuncBuilderMain template={false} functionId={"test_function"}/>
            </header>
        </div>
    )
}