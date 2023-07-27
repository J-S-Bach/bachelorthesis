import { MeasuringSeries } from "./MeasuringSeries.jsx";
import * as React from "react";

export const VideoCategoryTest = props => {
    const { srcs, name, onCategoryTested, mayStart = true, type = "", instant = false } = props;
    const [doneSeries, setDoneSeries] = React.useState([]);

    React.useEffect(() => {
        if (srcs.length === doneSeries.length) {
            !!onCategoryTested && onCategoryTested(doneSeries);
        }
    }, [JSON.stringify(doneSeries)]);

    return mayStart ? (
        <div style={{ padding: "24px" }}>
            <h1>{name}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Measured Times - Image load (in ms)</th>
                        <th>Average - Image load (in ms)</th>
                        <th>Measured Times - Page load (in ms)</th>
                        <th>Average - Page load (in ms)</th>
                        <th>Done</th>
                        <th>Contains Failure</th>
                    </tr>
                </thead>
                <tbody>
                    {srcs.map((src, i) => (
                        <tr key={src + i}>
                            <MeasuringSeries
                                instant={instant}
                                type={type}
                                video={{ name: src.substring(src.lastIndexOf("/") + 1), src }}
                                onSeriesMeasured={newSeries => {
                                    setDoneSeries([...doneSeries, {measuringType: name, ...newSeries}]);
                                }}
                                amount={4}
                                mayStart={doneSeries.length >= i || instant}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <></>
    );
};
