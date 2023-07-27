import "./App.css";
import { TestComponent as VideoTest } from "./Components/Video/TestComponent.jsx";
import { TestComponent as ImageTest } from "./Components/Image/TestComponent.jsx";
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <Routes>
            <Route
                path="/image"
                element={<ImageTest header="React default" />}
                />
            <Route
                path="*"
                element={<VideoTest header="React default" />}
            />
        </Routes>
    );
};

export default App;
