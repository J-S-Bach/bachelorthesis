import "./TestComponent.css";
import React, { useState } from "react";
import { ImageCategoryTest } from "./ImageCategoryTest.jsx";

export const TestComponent = ({ header }) => {
    const [categoriesDataWebM, setCategoriesDataWebM] = useState([]);
    const [categoriesDataH265, setCategoriesDataH265] = useState([]);
    const [counter, setCounter] = useState(0);

    React.useEffect(() => {
        if (5 === counter) {
            console.log(categoriesDataH265);
            console.log(categoriesDataWebM);
        }
    }, [JSON.stringify(categoriesDataWebM), JSON.stringify(categoriesDataH265)]);

    const currentHost = "http://192.168.56.1:3006";

    return (
        <div className="App">
            <header className="App-header">{header}</header>

            <h2>WebM</h2>
            <ImageCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 0}
                srcs={[
                    currentHost + "/media/jpeg/lossless/sample_1920%C3%971280_lossless.jpeg",
                    currentHost + "/media/jpeg/lossless/sample_5184×3456_lossless.jpeg",
                ]}
                name={"lossless"}
                type="image/jpeg"
            />

            <ImageCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 1}
                srcs={[
                    currentHost + "/media/jpeg/lowQuality/sample_1920%C3%971280_lowQuality.jpeg",
                    currentHost + "/media/jpeg/lowQuality/sample_5184×3456_lowQuality.jpeg",
                ]}
                name={"Low Quality"}
                type="image/jpeg"
            />

            <ImageCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 2}
                srcs={[
                    currentHost + "/media/jpeg/normalQuality/sample_1920%C3%971280_normalQuality.jpeg",
                    currentHost + "/media/jpeg/normalQuality/sample_5184×3456_normalQuality.jpeg",
                ]}
                name={"Normal Quality"}
                type="image/jpeg"
            />
            <h2>H265</h2>

            <ImageCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 3}
                srcs={[
                    currentHost + "/media/webp/lossless/sample_1920%C3%971280_lossless.webp",
                    currentHost + "/media/webp/lossless/sample_5184×3456_lossless.webp",
                ]}
                name={"lossless"}
                type="image/webp"
            />

            <ImageCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 4}
                srcs={[
                    currentHost + "/media/webp/lowQuality/sample_1920%C3%971280_lowQuality.webp",
                    currentHost + "/media/webp/lowQuality/sample_5184×3456_lowQuality.webp",
                ]}
                name={"Low Quality"}
                type="image/webp"
            />

            <ImageCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 5}
                srcs={[
                    currentHost + "/media/webp/normalQuality/sample_1920%C3%971280_normalQuality.webp",
                    currentHost + "/media/webp/normalQuality/sample_5184×3456_normalQuality.webp",
                ]}
                name={"Normal Quality"}
                type="image/webp"
            />
        </div>
    );
};
