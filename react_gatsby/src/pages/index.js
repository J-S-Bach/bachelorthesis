import 'react-app-polyfill/stable';
import * as React from "react";
import { TestComponent } from "../../Components/Video/TestComponent.jsx";

const IndexPage = () => {
    return <TestComponent header={"gatsby"} />;
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
