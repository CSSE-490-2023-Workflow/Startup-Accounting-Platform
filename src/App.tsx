import '@mantine/core/styles.css';
import {Home} from "./Home";
import {LoginPage} from "./pages/LoginPage/LoginPage";
import PrivateRoute from "./PrivateRoute";
import {
    Route, Routes, BrowserRouter
} from 'react-router-dom'
import WorkflowBuilder from "./pages/WorkflowBuilder/WorkflowBuilder";
import CustomFunctionBuilder from "./pages/CustomFunctionBuilder/CustomFunctionBuilder";
import CustomTemplateBuilder from './pages/CustomFunctionBuilder/CustomTemplateBuilder';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<PrivateRoute/>}>
                    <Route path='/' element={<Home/>}/>
                    <Route path='workflow/:id' element={<WorkflowBuilder/>}/>
                    <Route path='function/:id' element={<CustomFunctionBuilder/>}/>
                    <Route path='template/:id' element={<CustomTemplateBuilder/>}/>
                </Route>
                <Route path="/login" element={<LoginPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;