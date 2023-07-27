import React, { useState } from "react";
import { ImageCategoryTest } from "./ImageCategoryTest.jsx";

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
    const [categoriesDataJPEG, setCategoriesDataJPEG] = useState([]);
    const [categoriesDataWebP, setCategoriesDataWebP] = useState([]);
    const [counter, setCounter] = useState(0);

    React.useEffect(() => {
        if (6 === counter) {
            // Funktion zur Berechnung des Durchschnitts einer Messreihe
            const calculateAverage = series => series.map(el => el.fromComponentLoadTime).reduce((a, b) => a + b) / series.length;

            // Funktion zur Filterung der Daten anhand des Bildnamens und der Messart
            const getImageObject = (data, imageName, measuringType) =>
                data
                    .flat()
                    .filter(el => el.imageName.includes(imageName))
                    .find(el => el.measuringType === measuringType);

            // Funktion zur Berechnung der Durchschnittswerte für verschiedene Qualitätsstufen
            const getAverages = (data, imageName) => {
                // Messreihen für lossless, Normal Quality und Low Quality abrufen
                const losslessSeries = getImageObject(data, imageName, "lossless").measuringSeries;
                const normalQualitySeries = getImageObject(data, imageName, "Normal Quality").measuringSeries;
                const lowQualitySeries = getImageObject(data, imageName, "Low Quality").measuringSeries;

                // Durchschnittswerte für die verschiedenen Qualitätsstufen berechnen
                const losslessAverage = calculateAverage(losslessSeries);
                const normalQualityAverage = calculateAverage(normalQualitySeries);
                const lowQualityAverage = calculateAverage(lowQualitySeries);

                return [losslessAverage, normalQualityAverage, lowQualityAverage];
            };

            // Small Image WebP
            const smallImageWebPArr = ["sample_1920%C3%971280", "WebP", ...getAverages(categoriesDataWebP, "sample_1920%C3%971280")];

            // Big Image WebP
            const bigImageWebPArr = ["sample_5184×3456", "WebP", ...getAverages(categoriesDataWebP, "sample_5184×3456")];

            // Small Image JPEG
            const smallImageJPEGArr = ["sample_1920%C3%971280", "JPEG", ...getAverages(categoriesDataJPEG, "sample_1920%C3%971280")];

            // Big Image JPEG
            const bigImageJPEGArr = ["sample_5184×3456", "JPEG", ...getAverages(categoriesDataJPEG, "sample_5184×3456")];

            const blob = new Blob(
                [
                    arrayToCsv([
                        ["name", "mimeType", "losslessAverage", "normalQualityAverage", "lowQualityAveragy"],
                        bigImageJPEGArr,
                        smallImageJPEGArr,
                        bigImageWebPArr,
                        smallImageWebPArr,
                    ]),
                ],
                { type: "text/csv" }
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("download", "imageData.csv");
            a.click();
        }
    }, [JSON.stringify(categoriesDataJPEG), JSON.stringify(categoriesDataWebP)]);

    const currentHost = "http://192.168.178.28:3006";

    return (
        <div className="App">
            <header className="App-header">{header}</header>

            <h2>JPEG</h2>
            <ImageCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataJPEG([...categoriesDataJPEG, newCategory]);
                }}
                mayStart={counter >= 0 || instant}
                srcs={[
                    currentHost + "/media/jpeg/lossless/sample_1920%C3%971280_lossless.jpeg",
                    currentHost + "/media/jpeg/lossless/sample_5184×3456_lossless.jpeg",
                ]}
                name={"lossless"}
                type="image/jpeg"
            />

            <ImageCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataJPEG([...categoriesDataJPEG, newCategory]);
                }}
                mayStart={counter >= 1 || instant}
                srcs={[
                    currentHost + "/media/jpeg/lowQuality/sample_1920%C3%971280_lowQuality.jpeg",
                    currentHost + "/media/jpeg/lowQuality/sample_5184×3456_lowQuality.jpeg",
                ]}
                name={"Low Quality"}
                type="image/jpeg"
            />

            <ImageCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataJPEG([...categoriesDataJPEG, newCategory]);
                }}
                mayStart={counter >= 2 || instant}
                srcs={[
                    currentHost + "/media/jpeg/normalQuality/sample_1920%C3%971280_normalQuality.jpeg",
                    currentHost + "/media/jpeg/normalQuality/sample_5184×3456_normalQuality.jpeg",
                ]}
                name={"Normal Quality"}
                type="image/jpeg"
            />
            <h2>WebP</h2>

            <ImageCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebP([...categoriesDataWebP, newCategory]);
                }}
                mayStart={counter >= 3 || instant}
                srcs={[
                    currentHost + "/media/webp/lossless/sample_1920%C3%971280_lossless.webp",
                    currentHost + "/media/webp/lossless/sample_5184×3456_lossless.webp",
                ]}
                name={"lossless"}
                type="image/webp"
            />

            <ImageCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebP([...categoriesDataWebP, newCategory]);
                }}
                mayStart={counter >= 4 || instant}
                srcs={[
                    currentHost + "/media/webp/lowQuality/sample_1920%C3%971280_lowQuality.webp",
                    currentHost + "/media/webp/lowQuality/sample_5184×3456_lowQuality.webp",
                ]}
                name={"Low Quality"}
                type="image/webp"
            />

            <ImageCategoryTest
                instant={instant}
                onCategoryTested={newCategory => {
                    setCounter(counter + 1);
                    setCategoriesDataWebP([...categoriesDataWebP, newCategory]);
                }}
                mayStart={counter >= 5 || instant}
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
