const path = require("path");
const webpack = require("webpack");
/**
* @link ./file-changer.js
* file-changer plugin for using move file from anywhere to another place and placeholder some parameters.
* @type {ChangerPlugin|exports|module.exports}
*/
const Changer = require("webpack-file-changer");


/**
 * import common webpack settings
 */
const commonSettings = require("./webpack.config.common.js");

/**
 * @link https://github.com/webpack/docs/wiki/optimization#deduplication
 * @type DedupePlugin
 */
commonSettings.plugins.push(new webpack.optimize.DedupePlugin());
/**
 * @link https://github.com/webpack/docs/wiki/optimization#deduplication
 * @type DedupePlugin
 */
commonSettings.plugins.push(new webpack.optimize.UglifyJsPlugin());
/**
 * @link https://github.com/webpack/docs/wiki/optimization#minimize
 * @type OccurenceOrderPlugin
 */
commonSettings.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
/**
 * https://github.com/webpack/docs/wiki/optimization#chunks
 * @type LimitChunkCountPlugin
 */
commonSettings.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }));
/**
 * @link https://github.com/webpack/docs/wiki/optimization#chunks
 * @type MinChunkSizePlugin
 */
commonSettings.plugins.push(new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }));

/**
 *
 * @type {{app: *[]}}
 */
commonSettings.entry = {
    app: [commonSettings.paths.app]
};

/**
 *
 * @type {{path: (string|*), filename: string, chunkFilename: string}}
 */
commonSettings.output = {
    path: commonSettings.paths.build,
    filename: "bundle.[hash].js",
    chunkFilename: "[id].[hash].bundle.js"
};
/**
 path: commonSettings.paths.build,
 filename: "bundle.[hash].js",
 chunkFilename: "[id].[hash].bundle.js"
 */
commonSettings.plugins.push(new Changer({
    move: [{
        from: commonSettings.paths.assets,
        to: commonSettings.paths.build
    }
    ],
    change: [{
        file: path.join(commonSettings.output.path, "index.html"),
        parameters: {
            "bundle.js": "bundle.[hash].js",
            BUILD_TIME: new Date().toString(),
            BUILD_NO: new Date().getTime()
        }
    }
    ]
}));

module.exports = commonSettings;
