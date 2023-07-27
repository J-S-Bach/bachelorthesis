import React, { useState, useEffect } from "react";

export const ImageLoading = props => {
    const { src, mayStart, loadingFinished, instant = false } = props;
    const [componentLoadStartTime, setComponentLoadStartTime] = useState();
    const [imageFinished, setImageFinished] = useState(false);
    const [finishedImageTimoutId, setFinishedImageTimoutId] = useState();

    useEffect(() => {
        setComponentLoadStartTime(performance.now());

        // Image counts as failed if it didnt load in 10 secs
        setFinishedImageTimoutId(
            setTimeout(
                () => {
                    if (!imageFinished) {
                        console.log("timeout error");
                        finishImage(true);
                    }
                },
                instant ? 60000 : 20000
            )
        );

        return () => {
            checkedClearTimeout();
        };
    }, []);

    const checkedClearTimeout = () => {
        if (imageFinished && !!finishedImageTimoutId) {
            clearTimeout(finishedImageTimoutId);
        }

        return () => {
            checkedClearTimeout();
        };
    };

    useEffect(() => {
        checkedClearTimeout();
    }, [imageFinished]);

    const finishImage = (failed = false) => {
        const now = performance.now();
        setImageFinished(true);

        failed && console.error("Image", src, "failed, loading for", now - componentLoadStartTime, "ms.");

        loadingFinished({
            fromComponentLoadTime: now - componentLoadStartTime,
            succesfullyFinished: !failed,
        });
    };

    return mayStart || instant ? (
        <img
            hidden
            onLoad={() => {
                finishImage();
            }}
            onError={err => {
                console.log("native error");
                finishImage(true);
            }}
            src={src}></img>
    ) : (
        <></>
    );
};
