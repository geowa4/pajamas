module.exports = function(grunt) {

  grunt.initConfig({
      pkg    : '<json:package.json>'
    , meta   : {
          banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            '<%= pkg.author %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
      }
    , lint   : {
          files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
      }
    , qunit  : {
          files: ['test/**/*.html']
      }
    , concat : {
          debug: {
              src  : [
                  '<banner:meta.banner>'
                , '<file_strip_banner:src/<%= pkg.name %>.js>'
              ]
            , dest : 'dist/<%= pkg.name %>.js'
          }
        , production : {
              src  : [
                  '<banner:meta.banner>'
                , '<file_strip_banner:dist/<%= pkg.name %>.min.js>'
              ]
            , dest : 'dist/<%= pkg.name %>.min.js'
          }
      }
    , min    : {
        dist : {
            src  : [
                '<banner:meta.banner>'
              , '<config:concat.debug.dest>'
            ]
          , dest : 'dist/<%= pkg.name %>.min.js'
        }
      }
    , compress : {
        gzip : {
            options : {
              mode : 'gzip'
            }
          , files   : {
              'dist/<%= pkg.name %>.min.js.gz': 'dist/<%= pkg.name %>.min.js'
            }
        }
      }
    , watch  : {
          files : '<config:lint.files>'
        , tasks : 'lint qunit'
      }
    , server : {
          port : 8000
        , base : '.'
      }
    , jshint : {
          options : {
              eqeqeq    : true
            , forin     : true
            , immed     : true
            , latedef   : true
            , newcap    : true
            , noarg     : true
            , nonew     : true
            , quotmark  : 'single'
            , undef     : true
            , unused    : true
            , trailing  : true
            , asi       : true
            , eqnull    : true
            , evil      : true
            , expr      : true
            , laxbreak  : true
            , laxcomma  : true
            , sub       : true
            , browser   : true
            , onevar    : true
          }
        , globals : {
              QUnit   : true
            , define  : true
            , module  : true
            , exports : true
            , require : true
            , ender   : true
          }
      }
    , uglify : {}
    , clean : ['dist']
    , 'closure-compiler' : {
        dist : {
            js           : ['src/pajamas.js']
          , jsOutputFile : 'dist/pajamas.min.js'
          , options      : {
              compilation_level : 'SIMPLE_OPTIMIZATIONS'
            }
          }
      }
  })

  grunt.loadNpmTasks('grunt-contrib-compress')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-closure-compiler')

  grunt.registerTask('default', 'lint build qunit')

  grunt.registerTask('build', 'closure-compiler concat compress')

  grunt.registerTask('test', 'server watch')

}
