module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            test: {
                port : 8000
            }
        },
        dir: {
            src: 'src/tb',
            build: 'build',
            lib: 'lib',
            specs: 'specs'
        },
        components: {
            core: 'toolbar.core',
            config: 'require.config'
        },
        libs: {
            backbone: 'backbone/backbone.js',
            handlebars: 'handlebars/handlebars.js',
            jquery: 'jquery/jquery.js',
            jsclass: 'jsclass/class.js',
            parallel: 'paralleljs/lib/*.js',
            underscore: 'underscore/underscore.js'
        },
        concat: {
            options: {
                separator: '',
                process: function (src, filepath) {
                    return '\n/* ' + filepath + ' */\n' + src;
                }
            },
            core: {
                src: ['<%= dir.src %>/core/**/*.js'],
                dest: '<%= dir.build %>/<%= components.core %>.js'
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./",
                    mainConfigFile: "require.config.js",
                    name: "<%= concat.core.dest %>", // assumes a production build using almond
                    out: "<%= dir.build %>/<%= components.core %>.min.js"
                }
            }
        },
        bower: {
            target: {
                rjsConfig: 'app/config.js'
            },
            install: {}
        },

        requirejs_config_generator: {
            development: {
                "baseUrl": "",
                "deps": [],
                "paths": {},
                "shim": {}
            },
            production: {

            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
            },
            core: {
                files: {
                    '<%= dir.build %>/<%= components.core %>.min.js': ['<%= concat.core.dest %>']
                }
            },
            main: {
                files: {
                    '<%= dir.build %>/main.min.js': ['<%= dir.src %>/main.build.js']
                }
            },
            libs: {
                files: {
                    '<%= dir.build %>/libs.min.js': [
                        '<%= dir.lib %>/<%= libs.jquery %>',
                        '<%= dir.lib %>/<%= libs.underscore %>',
                        '<%= dir.lib %>/<%= libs.jsclass %>',
                        '<%= dir.lib %>/<%= libs.backbone %>',
                        '<%= dir.lib %>/<%= libs.parallel %>',
                        '<%= dir.lib %>/<%= libs.handlebars %>'
                    ]
                }
            },
            config: {
                files: {
                    '<%= dir.build %>/<%= components.config %>.min.js': ['src/<%= components.config %>.build.js']
                }
            }
        },
        cssmin: {
            compress: {
                files: {
                    'css/style.css': ['src/css/style.css']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js'],
            // options: {
            //     jshintrc: '.jshintrc'
            // }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        },

        csslint: {
            strict: {
                options: {
                    "import": 2
                },
                src: ['src/css/*.css']
            }
        },

        jasmine: {
            src: '<%= dir.src %>/core/**/*.js',
            options: {
                specs: '<%= dir.specs %>/**/*.spec.js',
                // vendor: '<%= dir.lib %>/**/*.js',
                helpers: '<%= dir.specs %>/**/*.helper.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    baseUrl: '',
                    requireConfigFile: 'SpecRunner.js'
                }
            },
            istanbul: {
                src: '<%= jasmine.src %>',
                options: {
                    // vendor: '<%= jasmine.options.vendor %>',
                    specs: '<%= jasmine.options.specs %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/json/coverage.json',
                        report: [
                            {type: 'lcov', options: {dir: 'coverage'}},
                            {type: 'text-summary'}
                        ],
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            baseUrl: '',
                            requireConfigFile: 'SpecRunner.js'
                        }
                    }
                }
            }
        },

        jslint: {
            src: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-jslint');

    grunt.registerTask('default', ['bower', 'jshint', 'jasmine:test', 'concat', 'uglify']);
    /* grunt:test */
    grunt.registerTask("test", ['bower', 'jshint', 'jslint', 'jasmine:istanbul']);
};