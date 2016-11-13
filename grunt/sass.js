module.exports = {
    // Development settings
  dev: {
    options: {
      outputStyle: 'compressed',
      sourceMap: true
    },
    files: [{
      'dist/styles/styles.min.css': ['src/styles/main.scss'],
      'dist/styles/lib.min.css': [
        'node_modules/angular-material/angular-material.scss'
      ]
    }]
  },
  // Production settings
  prod: {
    options: {
      outputStyle: 'compressed',
      sourceMap: false
    },
    files: [{
      expand: true,
      cwd: 'src/styles',
      src: ['*.scss'],
      dest: 'dist/styles',
      ext: '.css'
    }]
  }
};