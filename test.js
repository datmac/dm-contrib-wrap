'use strict';
var  path = require('path')
, basename = path.basename(path.dirname(__filename))
, util = require('util')
, should = require('should')
, tester = require('mill-core').tester
, command = require('./index.js')
;


describe(basename, function () {


    describe('PUT empty string', function () {
        it('should return 400', function (done) {
            tester(command, {})
            .send(' ')
            .end(function (err, res) {
                should.exist(res)
                res.should.equal('<?xml version="1.0"?>\n<root> </root>')
                done()
              }
            )
          }
        )
      }
    )
    describe('PUT string without parameter', function () {
        it('should return 400', function (done) {
            tester(command, {})
            .send('xxx\n')
            .end(function (err, res) {
                should.not.exist(err)
                should.exist(res)
                res.should.equal('<?xml version="1.0"?>\n<root>xxx</root>')
                done()
              }
            )
          }
        )
      }
    )
    describe('PUT simple string', function () {
        it('should return 200', function (done) {
            tester(command, {rootname : 'racine'})
            .send(' xxx\n')
            .end(function (err, res) {
                should.not.exist(err)
                should.exist(res)
                res.should.equal('<?xml version="1.0"?>\n<racine> xxx</racine>')
                done()
              }
            )
          }
        )
      }
    )
    describe('PUT string simple string whitout declaration', function () {
        it('should return 200', function (done) {
            tester(command, {rootname : 'racine', nodeclaration : true})
            .send(' xxx\n')
            .end(function (err, res) {
                should.not.exist(err)
                should.exist(res)
                res.should.equal('<racine> xxx</racine>')
                done()
              }
            )
          }
        )
      }
    )
    describe('PUT multipe string to wrap it whitout declaration', function () {
        it('should return 200', function (done) {
            tester(command, {rootname : 'rows', nodeclaration : true, name : 'row'})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                should.exist(res)
                res.should.equal('<rows><row>aaa</row><row>bbb</row><row>ccc</row></rows>')
                done()
              }
            )
          }
        )
      }
    )
    describe('PUT multipe string and wrap it without declaration but with attrs', function () {
        it('should return 200', function (done) {
            tester(command, {rootname :  'rows', nodeclaration : true, name : 'row', attrs : { name : 'value' } })
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                should.exist(res)
                res.should.equal('<rows><row name="value">aaa</row><row name="value">bbb</row><row name="value">ccc</row></rows>')
                done()
              }
            )
          }
        )
      }
    )


    describe('PUT multipe string and wrap it without declaration but with attrs and root attrs', function () {
        it('should return 200', function (done) {
            tester(command, {rootname : 'rows', rootattrs : {key : 'data'}, nodeclaration : true, name : 'row', attrs : { name : 'value' } })
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                should.exist(res)
                res.should.equal('<rows key="data"><row name="value">aaa</row><row name="value">bbb</row><row name="value">ccc</row></rows>')
                done()
              }
            )
          }
        )
      }
    )





  }
);
