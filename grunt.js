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
        dist: {
            src  : [
                '<banner:meta.banner>'
              , '<file_strip_banner:src/<%= pkg.name %>.js>'
            ]
          , dest : 'dist/<%= pkg.name %>.js'
        }
      }
    , min    : {
        dist : {
            src  : [
                '<banner:meta.banner>'
              , '<config:concat.dist.dest>'
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
              camelcase : true
            , eqeqeq    : true
            , forin     : true
            , immed     : true
            //, indent    : 2
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
              QUnit         : true
            , define        : true
            , module        : true
            , require       : true
          }
      }
    , uglify : {}
    , clean : ['dist']
  })

  grunt.loadNpmTasks('grunt-contrib')

  grunt.registerTask('default', 'lint qunit concat min compress')

  grunt.registerTask('verify', 'lint qunit')

  grunt.registerTask('test', 'server watch')

}
