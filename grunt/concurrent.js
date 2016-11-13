module.exports = {

    // Task options
    options: {
        limit: 3
    },

    // Dev tasks
    devFirst: [
        'clean',
        'jshint'
    ],
    devSecond: [
        'sass:dev',
        'uglify:prod'
    ],
    devThird: [
        'copy',
        'inject'
    ],

    // Production tasks
    prodFirst: [
        'clean',
        'jshint'
    ],
    prodSecond: [
        'sass:prod',
        'uglify'
    ],
    prodThird: [
        'copy'
    ],

    // Image tasks
    imgFirst: [
        'imagemin'
    ]
};