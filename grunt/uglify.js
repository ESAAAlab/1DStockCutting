module.exports = {
  dev: {
    options: {
      sourceMap: true,
    },
    files: [{
      'dist/scripts/app.min.js': ['src/scripts/*.js'],
    }]
  },
  prod: {
    options: {
      sourceMap: true,
    },
    files: [{
      'dist/scripts/app.min.js': ['src/scripts/*.js'],
      'dist/scripts/lib.min.js': [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-aria/angular-aria.js',
        'node_modules/angular-messages/angular-messages.js',
        'node_modules/angular-material/angular-material.js',
        'node_modules/ng-file-upload/dist/ng-file-upload-shim.js',
        'node_modules/ng-file-upload/dist/ng-file-upload.js',
        'node_modules/ng-storage/ngStorage.js',
        'node_modules/angular-translate/dist/angular-translate.js'
      ],
    }]
  }
};