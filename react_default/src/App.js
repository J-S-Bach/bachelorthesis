import "./App.css";
import { TestComponent as VideoTest } from "jsxtestvideo";
import { TestComponent as ImageTest } from "jsxtestimages";
import { Routes, Route } from "react-router-dom";
import React from "react"

const App = () => {

    return (
        <Routes>
            <Route
                path="/image"
                element={<VideoTest header="React default" />}
            />
            <Route
                path="*"
                element={<ImageTest header="React default" />}
            />
        </Routes>
    );
};

export default App;
