const path = require('path');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = {
  mode: 'production',
  entry: './JavaScript/index.js',
  output: {
    path: path.resolve(__dirname, '../Production'),
    filename: 'indеx.js'
  },
  // optimization: {
  //   minimize: false,
  // },
  plugins: [
    new MergeIntoSingleFilePlugin({
        files: {
            'ServiceWorker.js': [
              'Timetable/ServiceWorker.js'
            ],

            'Timetable/Script.js': [
              './**/*.js'
          ]
        },
        transform: (code)=>require('uglify-js').minify(code, { compress: true, mangle: true })
    })
  ]
}