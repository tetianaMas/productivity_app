const path = require('path');
const ENTRY = './src/app/app.js';
const OUTPUT = path.resolve(__dirname, 'dist');
const NODE_MODULES = [path.resolve(__dirname, 'src'), 'node_modules'];
const LESS_ALIAS = path.resolve(__dirname, 'src/assets/less/helpers');
const ROOT_ASSETS = path.resolve(__dirname, 'src/assets');
const HBS_HELPERS = path.join(__dirname, 'templates/helpers');
const PARTIAL_HEADER = path.resolve(
  __dirname,
  './src/app/components/header/template'
);
const PARTIAL_TAB = path.resolve(
  __dirname,
  './src/app/components/tab/template'
);
const IMAGES = './src/assets/images';
const CONTENT_BASE = './dist';
const ROOT_HTML = './src/index.html';

module.exports.paths = {
  entry: ENTRY,
  output: OUTPUT,
  node_modules: NODE_MODULES,
  less_files: LESS_ALIAS,
  root_assets: ROOT_ASSETS,
  hbs_helpers: HBS_HELPERS,
  partial_header: PARTIAL_HEADER,
  partial_tab: PARTIAL_TAB,
  images: IMAGES,
  content_base: CONTENT_BASE,
  root_html: ROOT_HTML,
};
