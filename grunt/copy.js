module.exports = {
  files: {
    cwd: 'src/',  // set working folder / root to copy
    src: ['**/*.html','*.png','*.xml','*.ico','*.txt'],      // copy all files and subfolders **with ending .html**
    dest: 'dist/',    // destination folder
    expand: true           // required when using cwd
  },
  svgjs: {
    cwd: 'node_modules/svg.js/dist/',  // set working folder / root to copy
    src: 'svg.min.js',      // copy all files and subfolders **with ending .html**
    dest: 'dist/scripts/',    // destination folder
    expand: true
  },
};