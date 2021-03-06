/**
 * Created by mudi on 17/08/16.
 */
module.exports = function(grunt) {
    
    //define app paths
    var pks = require('./package.json'),
        appConfig = {
            app: pks.appPath || 'app',
            karma:{
                unit: {
                    configFile: 'test/karma.conf.js',
                    singleRun: true
                }
            }
        };
    var serveStatic = require('serve-static');
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        //general settings
        appConfigs:appConfig,
        // pkg: grunt.file.readJSON('package.json'),
        pkg: pks,
        jshint:{
            app: {
                // options: {jshintrc: 'node_modules/jshint/src/jshint.js'},
                src: ['app/**/*.js']
            }
        },
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= appConfigs.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all', 'newer:jscs:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            serveStatic(appConfig.app)
                        ];
                    }
                }
            }
        },
        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= appConfigs.app %>/index.html'],
                ignorePath:  /\.\.\//
            },
            test: {
                devDependencies: true,
                src: '<%= appConfigs.karma.unit.configFile %>',
                ignorePath:  /\.\.\//,
                fileTypes:{
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            },
            sass: {
                src: ['<%= appConfigs.app %>/css/{,*/}*.{scss,sass}'],
                ignorePath: /(\.\.\/){1,2}bower_components\//
            }
        },
        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= appConfigs.app %>/css',
                cssDir: '<%= appConfigs.app %>/css',
                fontsDir: '<%= appConfigs.app %>/css/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            server: {
                options: {
                    sourcemap: true
                }
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'compass:server'
            ]
        }
    });
    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'wiredep',
            'concurrent:server',
            'connect:livereload',
            'watch'
        ]);
    });
    grunt.registerTask('default', [
        'newer:jshint',
        'newer:jscs',
        'test',
        'build'
    ]);
};