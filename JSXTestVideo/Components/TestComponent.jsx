import "./TestComponent.css";
import { VideoCategoryTest } from "./VideoCategoryTest.jsx";
import * as React from "react";

export const TestComponent = ({ header }) => {
    const [categoriesDataWebM, setCategoriesDataWebM] = React.useState([]);
    const [categoriesDataH265, setCategoriesDataH265] = React.useState([]);
    const [counter, setCounter] = React.useState(0);

    React.useEffect(() => {
        if (5 === counter) {
            console.log(categoriesDataH265);
            console.log(categoriesDataWebM);
        }
    });

    const currentHost = "http://192.168.56.1:3005";

    return (
        <div className="App">
            <header className="App-header">{header}</header>

            <h2>WebM</h2>
            <VideoCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 0}
                srcs={[
                    currentHost + "/media/webm/veryLowQuality/720p50_parkrun_ter_veryLowBitrate.webm",
                    currentHost + "/media/webm/veryLowQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_veryLowBitrate.webm",
                    currentHost + "/media/webm/veryLowQuality/sintel_trailer_2k_1080p24_veryLowBitrate.webm",
                ]}
                name={"Very Low Quality"}
                type="video/webm"
            />

            <VideoCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 1}
                srcs={[
                    currentHost + "/media/webm/LowQuality/720p50_parkrun_ter_lowBitrate.webm",
                    currentHost + "/media/webm/LowQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_lowBitrate.webm",
                    currentHost + "/media/webm/LowQuality/sintel_trailer_2k_1080p24_lowBitrate.webm",
                ]}
                name={"Low Quality"}
                type="video/webm"
            />

            <VideoCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 2}
                srcs={[
                    currentHost + "/media/webm/NormalQuality/720p50_parkrun_ter_normalQuality.webm",
                    currentHost + "/media/webm/NormalQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_normalQuality.webm",
                    currentHost + "/media/webm/NormalQuality/sintel_trailer_2k_1080p24_normalQuality.webm",
                ]}
                name={"Normal Quality"}
                type="video/webm"
            />

            {/* <VideoCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 2}
                srcs={[
                    currentHost + "/media/webm/Lossless/720p50_parkrun_ter_lossless.webm",
                    currentHost + "/media/webm/Lossless/Netflix_Aerial_4096x2160_60fps_8bit_420_lossless.webm",
                    currentHost + "/media/webm/Lossless/sintel_trailer_2k_1080p24_lossless.webm",
                ]}
                name={"Lossless"}
                type="video/webm"
            /> */}
            <h2>H265</h2>

            <VideoCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 3}
                srcs={[
                    currentHost + "/media/h265/veryLowQuality/720p50_parkrun_ter_lowBitrate.mp4",
                    currentHost + "/media/h265/veryLowQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_lowBitrate.mp4",
                    currentHost + "/media/h265/veryLowQuality/sintel_trailer_2k_1080p24_lowBitrate.mp4",
                ]}
                name={"Very Low Quality"}
                type="video/mp4"
            />

            <VideoCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 4}
                srcs={[
                    currentHost + "/media/h265/LowQuality/720p50_parkrun_ter_lowBitrate.mp4",
                    currentHost + "/media/h265/LowQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_lowBitrate.mp4",
                    currentHost + "/media/h265/LowQuality/sintel_trailer_2k_1080p24_lowBitrate.mp4",
                ]}
                name={"Low Quality"}
                type="video/mp4"
            />

            <VideoCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 5}
                srcs={[
                    currentHost + "/media/h265/NormalQuality/720p50_parkrun_ter_normalQuality.mp4",
                    currentHost + "/media/h265/NormalQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_normalQuality.mp4",
                    currentHost + "/media/h265/NormalQuality/sintel_trailer_2k_1080p24_normalQuality.mp4",
                ]}
                name={"Normal Quality"}
                type="video/mp4"
            />

            {/* <VideoCategoryTest
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 7}
                srcs={[
                    currentHost + "/media/h265/Lossless/720p50_parkrun_ter_lossless.mp4",
                    currentHost + "/media/h265/Lossless/Netflix_Aerial_4096x2160_60fps_8bit_420_lossless.mp4",
                    currentHost + "/media/h265/Lossless/sintel_trailer_2k_1080p24_lossless.mp4",
                ]}
                name={"Lossless"}
                type="video/mp4"
            /> */}
        </div>
    );
};
