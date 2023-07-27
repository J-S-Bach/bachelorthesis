import React, { useState, useEffect } from "react";
import { ImageLoading } from "./SingleImage.jsx";

export const MeasuringSeries = props => {
    const { image, onSeriesMeasured, amount = 5, mayStart = true, type = "", instant = false } = props;
    const [measuredImages, setMeasuredImages] = useState([]);

    const images = Array(amount).fill(image);

    useEffect(() => {
        if (amount === measuredImages.length) {
            !!onSeriesMeasured && onSeriesMeasured({ imageName: image.name, measuringSeries: measuredImages });
        }
    }, [JSON.stringify(measuredImages)]);

    return mayStart ? (
        <>
            <th>{image.name}</th>
            <th>{measuredImages.map(image => image.fromComponentLoadTime.toFixed(4)).join(", ")}</th>
            <th>
                {measuredImages.length !== 0 &&
                    (
                        measuredImages.map(image => image.fromComponentLoadTime).reduce((time1, time2) => time1 + time2) /
                        measuredImages.length
                    ).toFixed(4)}
            </th>
            <th>
                {measuredImages.length} / {amount}
            </th>
            <th>{measuredImages.some(image => !image.succesfullyFinished) + ""}</th>
            <th>
                {images.map((currentImage, i) => (
                    <ImageLoading
                        type={type}
                        key={`${currentImage.name}_${i}`}
                        src={currentImage.src}
                        mayStart={measuredImages.length >= i || instant}
                        loadingFinished={image => {
                            setMeasuredImages([
                                ...measuredImages,
                                {
                                    ...image,
                                },
                            ]);
                        }}
                        instant={instant}
                    />
                ))}
            </th>
        </>
    ) : (
        <></>
    );
};
