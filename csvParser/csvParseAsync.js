const fs = require("fs");
const { parse } = require("csv-parse");

const path = "D:/messungen";
const OS = {
    UBUNTU: "ubuntu",
    WINDOWS10: "windows 10",
    WINDOWSXP: "Windows XP",
    WINDOWS11: "Windows 11",
};

const MACHINE = {
    ACER: "Acer Aspire M5-581(G)",
    ASUS: "Asus X55CR",
    DESKTOP: "Desktop PC",
    THINKPAD: "Lenovo 20Y7003XGE",
};

const FILEGENERATOR = {
    DOOL: "dool",
    PERFMON: "perfmon",
};

const getCSVData = async (path, fromLine) => {
    const data = [];
    return new Promise(resolve =>
        fs
            .createReadStream(path)
            .pipe(
                parse({
                    delimiter: ",",
                    columns: true,
                    ltrim: true,
                    from_line: fromLine,
                    relax_column_count: true,
                })
            )
            .on("data", function (row) {
                data.push(row);
            })
            .on("error", function (error) {
                console.log(error.message);
            })
            .on("end", function () {
                resolve(data);
            })
    );
};

const getIndexOfKey = (object, value) => Object.keys(object).findIndex(key => key.toLowerCase().includes(value.toLowerCase()));
const getAllIndexesOfKey = (object, value) =>
    Object.keys(object)
        .map((e, i) => (e.includes(value) ? i : ""))
        .filter(String);

const getValueByKeySearch = (object, value) => {
    const keyIndex = getIndexOfKey(object, value);

    return keyIndex ? Object.values(object)[keyIndex] : undefined;
};

const getAverageValueByKeySearch = (object, value) => {
    const indices = getAllIndexesOfKey(object, value);
    const values = indices.map(index => parseInt(Object.values(object)[index]));

    const average = values.length !== 0 ? values.reduce((a, b) => a + b) / value.length : null;

    return isNaN(average) ? undefined : average;
};

const checkFileGenerator = async path => {
    return await getCSVData(path).then(data => {
        let fileGenerator;
        const firstEntry = Object.keys(data[0])[0];

        if (firstEntry.includes("dool")) {
            fileGenerator = FILEGENERATOR.DOOL;
        } else if (firstEntry.includes("PDH-CSV")) {
            fileGenerator = FILEGENERATOR.PERFMON;
        } else {
            throw new Error("Alaaarm, Alaaaarm! '" + firstEntry + "'" + "in file " + path + " not recogniced");
        }
        return fileGenerator;
    });
};

const readDool = async path =>
    await getCSVData(path, 6).then(rawData => {
        const usedRam = rawData.map(data => parseFloat(data.used));
        const freeRam = rawData.map(data => parseFloat(data.free));
        const usrUsedCPU = rawData.map(data => parseFloat(data.usr));
        const sysUsedCPU = rawData.map(data => parseFloat(data.sys));
        const waitCPU = rawData.map(data => parseFloat(data.wai));

        const cleanData = [
            //Im not sure if readPerfMon and Dool measured the same thing.
            // Anyway i dont know if i want to analyze disk performance anyway since it doesnt seem to relevant
            undefined,
            undefined,
            undefined,
            usedRam.length !== 0 ? usedRam.reduce((a, b) => a + b) / rawData.length : null,
            freeRam.length !== 0 ? rawData.map(data => parseFloat(data.free)).reduce((a, b) => a + b) / rawData.length : null,
            usrUsedCPU.length !== 0 && sysUsedCPU !== 0
                ? rawData.map(data => parseFloat(data.usr)).reduce((a, b) => a + b) / rawData.length +
                  rawData.map(data => parseFloat(data.sys)).reduce((a, b) => a + b) / rawData.length
                : null,
            waitCPU.length !== 0 ? rawData.map(data => parseFloat(data.wai)).reduce((a, b) => a + b) / rawData.length : null,
        ];

        return cleanData;
    });

const getRamByMachine = machine => {
    switch (machine) {
        case MACHINE.ACER:
            return 4 * 1024 * 1024 * 1024;
        case MACHINE.ASUS:
            return 6 * 1024 * 1024 * 1024;
        case MACHINE.DESKTOP:
            return 16 * 1024 * 1024 * 1024;
        case MACHINE.THINKPAD:
            return 16 * 1024 * 1024 * 1024;
    }
};

const readPerfMon = async (path, machine) =>
    await getCSVData(path).then(rawData => {
        const dataObject = {
            ramUnusedBytes: [],
            ramAvailableBytes: [],
            diskReadTime: [],
            diskWriteTime: [],
            diskTime: [],
            processorTime: [],
            processInterrupts: [],
        };

        rawData.forEach(rawRow => {
            const processorTime = getAverageValueByKeySearch(rawRow, "Prozessorzeit");
            const processorInterrupts = getAverageValueByKeySearch(rawRow, "Interrupts/s");
            const diskReadTime = parseInt(getValueByKeySearch(rawRow, "Lesezeit"));
            const diskWriteTime = parseInt(getValueByKeySearch(rawRow, "Schreibzeit"));
            const diskTime = parseInt(getValueByKeySearch(rawRow, "\\\\Zeit (%)"));
            const availableBytes = parseInt(getValueByKeySearch(rawRow, "Verf�gbare Bytes"));

            !!diskReadTime && dataObject.diskReadTime.push(diskReadTime);
            !!diskWriteTime && dataObject.diskWriteTime.push(diskWriteTime);
            !!diskTime && dataObject.diskTime.push(diskTime);
            dataObject.ramUnusedBytes.push(getRamByMachine(machine) - availableBytes);
            dataObject.ramAvailableBytes.push(availableBytes);
            !!processorTime && dataObject.processorTime.push(processorTime);
            !!processorInterrupts && dataObject.processInterrupts.push(processorInterrupts / (5 * 60));
        });

        return [
            dataObject.diskReadTime.length !== 0 ? dataObject.diskReadTime.reduce((a, b) => a + b) / dataObject.diskReadTime.length : null,
            dataObject.diskWriteTime.length !== 0
                ? dataObject.diskWriteTime.reduce((a, b) => a + b) / dataObject.diskWriteTime.length
                : null,
            dataObject.diskTime.length !== 0 ? dataObject.diskTime.reduce((a, b) => a + b) / dataObject.diskTime.length : null,
            dataObject.ramUnusedBytes.reduce((a, b) => a + b) / dataObject.ramUnusedBytes.length,
            dataObject.ramAvailableBytes.reduce((a, b) => a + b) / dataObject.ramAvailableBytes.length,
            dataObject.processorTime.length !== 0
                ? dataObject.processorTime.reduce((a, b) => a + b) / dataObject.processorTime.length
                : null,
            dataObject.processInterrupts.reduce((a, b) => a + b) / dataObject.processInterrupts.length,
        ];
    });

const getDataRows = async path =>
    await getCSVData(path).then(data => {
        return data.map(row => Object.values(row).map((el) => el === NaN || el === "NaN" ? null : el));
    });

const getData = (path, onVideoEnd, onImageEnd, onUsageEnd) => {
    const imagePromises = [];
    const videoPromises = [];
    const usagePromises = [];
    const checkFilePromises = [];

    async function ls(path, data = {}) {
        const folderFiles = fs.readdirSync(path);

        folderFiles.forEach(async file => {
            const fullPath = path + "/" + file;
            if (fs.statSync(fullPath).isDirectory()) {
                const newData = {};
                const folderName = path.substr(path.lastIndexOf("/") + 1).toLowerCase();

                switch (folderName) {
                    case "ubuntu":
                        newData.operatingSystem = OS.UBUNTU;
                        break;
                    case "windows 10":
                        newData.operatingSystem = OS.WINDOWS10;
                        break;
                    case "windows 11":
                        newData.operatingSystem = OS.WINDOWS11;
                        break;
                    case "windowsxp" || "windows xp":
                        newData.operatingSystem = OS.WINDOWSXP;
                        break;
                    case "acer":
                        newData.machine = MACHINE.ACER;
                        break;
                    case "asus":
                        newData.machine = MACHINE.ASUS;
                        break;
                    case "desktop":
                        newData.machine = MACHINE.DESKTOP;
                        break;
                    case "ThinkPad":
                    case "thinkpad":
                        newData.machine = MACHINE.THINKPAD;
                        break;
                    case "messungen":
                        break;
                    case "images":
                        break;
                    default:
                        throw new Error("I think we fucked up the folder " + folderName);
                }

                ls(fullPath, { ...data, ...newData });
            } else if (file.startsWith("usageData")) {
                const formatUsageData = smoartData => {
                    const fileParts = file.split("_");

                    return [fileParts.at(-1).split(".")[0], fileParts[2], data.machine, fileParts[1], data.operatingSystem, ...smoartData];
                };

                checkFilePromises.push(
                    checkFileGenerator(fullPath).then(fileGenerator => {
                        switch (fileGenerator) {
                            case FILEGENERATOR.DOOL:
                                usagePromises.push(readDool(fullPath).then(formatUsageData));
                                break;
                            case FILEGENERATOR.PERFMON:
                                usagePromises.push(readPerfMon(fullPath, data.machine).then(formatUsageData));
                                break;
                            default:
                                throw new Error("Did not find the FileGenerator in Usage data");
                        }
                    })
                );
            } else if (file.startsWith("videoData")) {
                videoPromises.push(
                    getDataRows(fullPath).then(rows => {
                        const fileParts = file.split("_");

                        return rows.map(row => [fileParts.at(-1).split(".")[0], data.machine, fileParts[1], data.operatingSystem, ...row]);
                    })
                );
            } else if (file.startsWith("imageData")) {
                imagePromises.push(
                    getDataRows(fullPath).then(rows => {
                        const fileParts = file.split("_");

                        return rows.map(row => [fileParts.at(-1).split(".")[0], data.machine, fileParts[1], data.operatingSystem, ...row]);
                    })
                );
            }
        });
    }

    ls(path);

    Promise.all(videoPromises).then(onVideoEnd);
    Promise.all(imagePromises).then(onImageEnd);
    Promise.all(checkFilePromises).then(() => {
        Promise.all(usagePromises).then(onUsageEnd);
    });
};

const arrayToCsv = data =>
    data
        .map(row =>
            row
                .map(String)
                .map(v => v.replaceAll('"', '""'))
                .map(v => `"${v}"`)
                .join(",")
        )
        .join("\r\n");

const writeImageData = data => {
    const csv = arrayToCsv([
        ["browser", "machine", "framework", "operatingSystem", "name", "mimeType", "losslessAverage", "normalAverage", "lowQualityAverage"],
        ...data.flat(),
    ]);
    // fs.writeFileSync("./finalFiles/imageData.csv", csv);
};

const writeVideoData = data => {
    const csv = arrayToCsv([
        [
            "browser",
            "machine",
            "framework",
            "operatingSystem",
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
        ...data.flat(),
    ]);

    fs.writeFileSync("./finalFiles/videoData.csv", csv);
};

const writeUsageData = data => {
    const csv = arrayToCsv([
        // Disk ReadTime /s,  Disk WriteTime /S, Disk Time /S, RAM in use mb, Ram Available mb, CPU Processor time %, CPU Interrupts %
        [
            "type",
            "browser",
            "machine",
            "framework",
            "operatingSystem",
            "diskReadTime",
            "disWriteTime",
            "diskTime",
            "ramInUse",
            "ramAvailable",
            "cpuProcessorTime",
            "cpuInterrupts",
        ],
        ...data,
    ]);

    // fs.writeFileSync("./finalFiles/usageData.csv", csv);
};

getData(path, writeVideoData, writeImageData, writeUsageData);
