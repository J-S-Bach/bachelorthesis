import * as React from "react";
import { TestComponent } from "jsxtestimages";

const IndexPage = () => {
    return <TestComponent header={"gatsby"} />;
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
