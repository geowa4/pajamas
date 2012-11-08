/*global pj:true module:true test:true strictEqual:true*/

module('serialize')

test('pj.param', function () {
  var params

  params = {
      foo  : 'bar'
    , baz  : 42
    , quux : 'All your base are belong to us'
  }
  strictEqual(pj.param(params), 'foo=bar&baz=42&quux=All+your+base+are+belong+to+us', 'simple')

  params = {
      'string'    : 'foo'
    , 'null'      : null
    , 'undefined' : undefined
  }
  strictEqual(pj.param(params), 'string=foo&null=&undefined=', 'handle nulls and undefineds properly')

  params = {
      someName     : [1, 2, 3]
    , regularThing : 'blah'
  }
  strictEqual(pj.param(params), 'someName%5B%5D=1&someName%5B%5D=2&someName%5B%5D=3&regularThing=blah', 'with array')

  params = {
      foo : ['a', 'b', 'c']
  }
  strictEqual(pj.param(params), 'foo%5B%5D=a&foo%5B%5D=b&foo%5B%5D=c', 'with array of strings')

  params = {
      foo : ['baz', 42, 'All your base are belong to us']
  }
  strictEqual(pj.param(params), 'foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All+your+base+are+belong+to+us', 'more array')

  params = {
      foo : {
          bar  : 'baz'
        , beep : 42
        , quux : 'All your base are belong to us'
      }
  }
  strictEqual(pj.param(params), 'foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All+your+base+are+belong+to+us', 'more object')

  params = {
      a : [1,2]
    , b : {
          c : 3
        , d : [4, 5]
        , e : {
              x : [6]
            , y : 7
            , z : [8, 9]
          }
        , f : true
        , g : false
        , h : undefined
      }
    , i : [10, 11]
    , j : true
    , k : false
    , l : [undefined, 0]
    , m : 'cowboy hat?'
  }
  strictEqual(decodeURIComponent(pj.param(params)), 'a[]=1&a[]=2&b[c]=3&b[d][]=4&b[d][]=5&b[e][x][]=6&b[e][y]=7&b[e][z][]=8&b[e][z][]=9&b[f]=true&b[g]=false&b[h]=&i[]=10&i[]=11&j=true&k=false&l[]=&l[]=0&m=cowboy+hat?', 'huge structure' );

  params = {
      a : [0, [1, 2], [3, [4, 5], [6]], {b : [7, [8, 9], [{c : 10, d: 11}], [[12]], [[[13]]], {e : {f : {g : [14, [15]]}}}, 16]}, 17]
  }
  strictEqual(decodeURIComponent(pj.param(params)), 'a[]=0&a[1][]=1&a[1][]=2&a[2][]=3&a[2][1][]=4&a[2][1][]=5&a[2][2][]=6&a[3][b][]=7&a[3][b][1][]=8&a[3][b][1][]=9&a[3][b][2][0][c]=10&a[3][b][2][0][d]=11&a[3][b][3][0][]=12&a[3][b][4][0][0][]=13&a[3][b][5][e][f][g][]=14&a[3][b][5][e][f][g][1][]=15&a[3][b][]=16&a[]=17', 'nested arrays' )

  params = {
      a : [1,2,3]
    , 'b[]' : [4,5,6]
    , 'c[d]': [7,8,9]
    , e : {
          f : [10]
        , g : [11,12]
        , h : 13
      }
  }
  strictEqual(decodeURIComponent(pj.param(params)), 'a[]=1&a[]=2&a[]=3&b[]=4&b[]=5&b[]=6&c[d][]=7&c[d][]=8&c[d][]=9&e[f][]=10&e[g][]=11&e[g][]=12&e[h]=13', 'Make sure params are not double-encoded.' )
})


module('pj.serialize')

test('serialize form to query string', function () {
  strictEqual(pj.serialize(document.getElementById('form'))
    , 'action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3'
    , 'large form')
})
















