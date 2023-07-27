import { VideoCategoryTest } from "./VideoCategoryTest.jsx";
import * as React from "react";

const arrayToCsv = data =>
    data
        .map(row =>
            row
                .map(String)
                .map(v => v.replace(/"/g, '""'))
                .map(v => `"${v}"`)
                .join(",")
        )
        .join("\r\n");

export const TestComponent = ({ header, instant = false }) => {
    const [categoriesDataWebM, setCategoriesDataWebM] = React.useState([]);
    const [categoriesDataH265, setCategoriesDataH265] = React.useState([]);
    const [counter, setCounter] = React.useState(0);

    React.useEffect(() => {
        if (6 === counter) {
            // Funktion zur Berechnung des Durchschnitts einer Messreihe
            const calculateAverage = series => series.reduce((a, b) => a + b) / series.length;

            // Funktion zur Filterung der Daten anhand des Bildnamens und der Messart
            const getVideoObject = (data, videoName, measuringType) =>
                data
                    .flat()
                    .filter(el => el.videoName.includes(videoName))
                    .find(el => el.measuringType === measuringType);

            const unsuccessFullyFinished = series => series.some(video => !video.succesfullyFinished);

            // Funktion zur Berechnung der Durchschnittswerte für verschiedene Qualitätsstufen
            const getAverages = (data, videoName) => {
                // Messreihen für veryLowQuality, Normal Quality und Low Quality abrufen
                const normalQualitySeries = getVideoObject(data, videoName, "Normal Quality").measuringSeries;
                const lowQualitySeries = getVideoObject(data, videoName, "Low Quality").measuringSeries;
                const veryLowQualitySeries = getVideoObject(data, videoName, "Very Low Quality").measuringSeries;

                // Durchschnittswerte für die verschiedenen Qualitätsstufen berechnen von Page Load
                const normalQualityAveragePageLoad = calculateAverage(normalQualitySeries.map(el => el.fromComponentLoadTime));
                const lowQualityAveragePageLoad = calculateAverage(lowQualitySeries.map(el => el.fromComponentLoadTime));
                const veryLowQualityAveragePageLoad = calculateAverage(veryLowQualitySeries.map(el => el.fromComponentLoadTime));

                // Durchschnittswerte für die verschiedenen Qualitätsstufen berechnen von Image Load
                const normalQualityAverageVideoLoad = calculateAverage(normalQualitySeries.map(el => el.fromImageLoadTime));
                const lowQualityAverageVideoLoad = calculateAverage(lowQualitySeries.map(el => el.fromImageLoadTime));
                const veryLowQualityAverageVideoLoad = calculateAverage(veryLowQualitySeries.map(el => el.fromImageLoadTime));

                return [
                    normalQualityAveragePageLoad,
                    lowQualityAveragePageLoad,
                    veryLowQualityAveragePageLoad,
                    normalQualityAverageVideoLoad,
                    lowQualityAverageVideoLoad,
                    veryLowQualityAverageVideoLoad,
                    unsuccessFullyFinished(normalQualitySeries),
                    unsuccessFullyFinished(lowQualitySeries),
                    unsuccessFullyFinished(veryLowQualitySeries),
                ];
            };

            const parkrunVideoH265Arr = ["720p50_parkrun_ter", "H265", ...getAverages(categoriesDataH265, "720p50_parkrun_ter")];
            const netflixVideoH265Arr = [
                "Netflix_Aerial_4096x2160_60fps_8bit_420",
                "H265",
                ...getAverages(categoriesDataH265, "Netflix_Aerial"),
            ];
            const sintelVideoH265Arr = [
                "sintel_trailer_2k_1080p24_lowBitrate",
                "H265",
                ...getAverages(categoriesDataH265, "sintel_trailer_2k_1080p24"),
            ];

            const parkrunVideoWebMArr = ["720p50_parkrun_ter", "WebM", ...getAverages(categoriesDataWebM, "720p50_parkrun_ter")];
            const netflixVideoWebMArr = [
                "Netflix_Aerial_4096x2160_60fps_8bit_420",
                "WebM",
                ...getAverages(categoriesDataWebM, "Netflix_Aerial_4096x2160_60fps_8bit_420"),
            ];
            const sintelVideoWebMArr = [
                "sintel_trailer_2k_1080p24_lowBitrate",
                "WebM",
                ...getAverages(categoriesDataH265, "sintel_trailer_2k_1080p24"),
            ];

            const blob = new Blob(
                [
                    arrayToCsv([
                        [
                            "name",
                            "mimeType",
                            "normalQualityAveragePageLoad",
                            "lowQualityAveragyPageLoad",
                            "veryLowQualityAveragePageLoad",
                            "normalQualityAverageVideoLoad",
                            "lowQualityAveragyVideoLoad",
                            "veryLowQualityAverageVideoLoad",
                            "normalQualityFailure",
                            "lowQualityFailure",
                            "veryLowQualityFailure",
                        ],
                        parkrunVideoH265Arr,
                        netflixVideoH265Arr,
                        sintelVideoH265Arr,
                        parkrunVideoWebMArr,
                        netflixVideoWebMArr,
                        sintelVideoWebMArr,
                    ]),
                ],
                { type: "text/csv" }
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("download", "videoData.csv");
            a.click();
        }
    });

    const currentHost = "http://192.168.178.28:3005";

    return (
        <div className="App">
            <header className="App-header">{header}</header>

            <h2>WebM</h2>
            <VideoCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 0 || instant}
                srcs={[
                    currentHost + "/media/webm/veryLowQuality/720p50_parkrun_ter_veryLowBitrate.webm",
                    currentHost + "/media/webm/veryLowQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_veryLowBitrate.webm",
                    currentHost + "/media/webm/veryLowQuality/sintel_trailer_2k_1080p24_veryLowBitrate.webm",
                ]}
                name={"Very Low Quality"}
                type="video/webm"
            />

            <VideoCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 1 || instant}
                srcs={[
                    currentHost + "/media/webm/LowQuality/720p50_parkrun_ter_lowBitrate.webm",
                    currentHost + "/media/webm/LowQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_lowBitrate.webm",
                    currentHost + "/media/webm/LowQuality/sintel_trailer_2k_1080p24_lowBitrate.webm",
                ]}
                name={"Low Quality"}
                type="video/webm"
            />

            <VideoCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebM([...categoriesDataWebM, newCategory]);
                }}
                mayStart={counter >= 2 || instant}
                srcs={[
                    currentHost + "/media/webm/NormalQuality/720p50_parkrun_ter_normalQuality.webm",
                    currentHost + "/media/webm/NormalQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_normalQuality.webm",
                    currentHost + "/media/webm/NormalQuality/sintel_trailer_2k_1080p24_normalQuality.webm",
                ]}
                name={"Normal Quality"}
                type="video/webm"
            />

            <h2>H265</h2>

            <VideoCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 3 || instant}
                srcs={[
                    currentHost + "/media/h265/veryLowQuality/720p50_parkrun_ter_lowBitrate.mp4",
                    currentHost + "/media/h265/veryLowQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_lowBitrate.mp4",
                    currentHost + "/media/h265/veryLowQuality/sintel_trailer_2k_1080p24_lowBitrate.mp4",
                ]}
                name={"Very Low Quality"}
                type="video/mp4"
            />

            <VideoCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 4 || instant}
                srcs={[
                    currentHost + "/media/h265/LowQuality/720p50_parkrun_ter_lowBitrate.mp4",
                    currentHost + "/media/h265/LowQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_lowBitrate.mp4",
                    currentHost + "/media/h265/LowQuality/sintel_trailer_2k_1080p24_lowBitrate.mp4",
                ]}
                name={"Low Quality"}
                type="video/mp4"
            />

            <VideoCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataH265([...categoriesDataH265, newCategory]);
                }}
                mayStart={counter >= 5 || instant}
                srcs={[
                    currentHost + "/media/h265/NormalQuality/720p50_parkrun_ter_normalQuality.mp4",
                    currentHost + "/media/h265/NormalQuality/Netflix_Aerial_4096x2160_60fps_8bit_420_normalQuality.mp4",
                    currentHost + "/media/h265/NormalQuality/sintel_trailer_2k_1080p24_normalQuality.mp4",
                ]}
                name={"Normal Quality"}
                type="video/mp4"
            />
        </div>
    );
};
