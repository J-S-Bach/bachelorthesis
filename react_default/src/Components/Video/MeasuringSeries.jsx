import { VideoLoading } from "./SingleVideo.jsx";
import * as React from "react";

export const MeasuringSeries = props => {
    const { video, onSeriesMeasured, amount = 5, mayStart = true, type = "", instant = false } = props;
    const [measuredVideos, setMeasuredVideos] = React.useState([]);

    const videos = Array(amount).fill(video);

    React.useEffect(() => {
        if (amount === measuredVideos.length) {
            !!onSeriesMeasured && onSeriesMeasured({ videoName: video.name, measuringSeries: measuredVideos });
        }
    }, [JSON.stringify(measuredVideos)]);

    return mayStart ? (
        <>
            <th>{video.name}</th>
            <th>{measuredVideos.map(video => video.fromImageLoadTime.toFixed(4)).join(", ")}</th>
            <th>
                {measuredVideos.length !== 0 &&
                    (
                        measuredVideos.map(video => video.fromImageLoadTime).reduce((time1, time2) => time1 + time2) / measuredVideos.length
                    )?.toFixed(4)}
            </th>
            <th>{measuredVideos.map(video => video.fromComponentLoadTime.toFixed(4)).join(", ")}</th>
            <th>
                {measuredVideos.length !== 0 &&
                    (
                        measuredVideos.map(video => video.fromComponentLoadTime).reduce((time1, time2) => time1 + time2) /
                        measuredVideos.length
                    )?.toFixed(4)}
            </th>
            <th>
                {measuredVideos.length} / {amount}
            </th>
            <th>{measuredVideos.some(video => !video.succesfullyFinished) + ""}</th>
            <th>
                {videos.map((currentVideo, i) => (
                    <VideoLoading
                        type={type}
                        key={`${currentVideo.name}_${i}`}
                        src={currentVideo.src}
                        instant={instant}
                        mayStart={measuredVideos.length >= i || instant}
                        loadingFinished={video => {
                            setMeasuredVideos([
                                ...measuredVideos,
                                {
                                    ...video,
                                },
                            ]);
                        }}
                    />
                ))}
            </th>
        </>
    ) : (
        <></>
    );
};
