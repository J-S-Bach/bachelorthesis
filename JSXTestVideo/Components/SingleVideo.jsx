import * as React from "react";

export const VideoLoading = props => {
    const { src, mayStart, loadingFinished, type = "" } = props;
    const [imageLoadingStartTime, setImageLoadingStartTime] = React.useState();
    const [componentLoadStartTime, setComponentLoadStartTime] = React.useState();
    const [videoFinished, setVideoFinished] = React.useState(false);
    const [finishedVideoTimoutId, setFinishedVideoTimoutId] = React.useState();

    React.useEffect(() => {
        setComponentLoadStartTime(performance.now());

        // Video counts as failed if it didnt load in 20 secs
        setFinishedVideoTimoutId(
            setTimeout(() => {
                if (!videoFinished) {
                    console.log("timeout error");
                    finishVideo(true);
                }
            }, 20000)
        );
    }, []);

    React.useEffect(() => {
        if (videoFinished && !!finishedVideoTimoutId) {
            clearTimeout(finishedVideoTimoutId);
        }
    }, [videoFinished]);

    const finishVideo = (failed = false) => {
        const now = performance.now();
        setVideoFinished(true);

        failed && console.error("Video", src, "failed, loading for", now - componentLoadStartTime, "ms.");

        loadingFinished({
            fromComponentLoadTime: now - componentLoadStartTime,
            fromImageLoadTime: now - imageLoadingStartTime,
            succesfullyFinished: !failed,
        });
    };

    return mayStart ? (
        <video
            hidden
            controls
            onLoadStart={() => {
                setImageLoadingStartTime(performance.now());
            }}
            onLoadedData={() => {
                finishVideo();
            }}
            onError={e => {
                fetch(src)
                    .then(resp => console.info("native error:", resp.status, "while requesting", src))
                    .catch(err => console.log(err))
                    .finally(finishVideo(true));
            }}>
            <source
                src={src}
                type={type}
            />
        </video>
    ) : (
        <></>
    );
};
