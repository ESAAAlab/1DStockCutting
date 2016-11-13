module.exports = {
  multiple: {
    scriptSrc: 'build/devscript.js',
    files: [{
      expand: true,
      cwd: 'src',
      src: ['**/*.html'],
      dest: 'dist'
    }]
  }
};