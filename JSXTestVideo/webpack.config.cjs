// webpack.config.js
module.exports = {
    mode: "production",
    entry: {
        index: { import: "./Components/TestComponent.jsx" },
    },
    resolve: {
        extensions: [".ts", ".js", ".jsx"],
        alias: {
            TestComponent: require.resolve("./Components/TestComponent.jsx"),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        filename: "components.bundle.min.js",
        library: { type: "umd", name: "jsxtestvideo" },
        libraryTarget: "umd",
        clean: true,
        globalObject: "this",
    },
};
