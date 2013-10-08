'use strict';

var path = require('path')
, basename = path.basename(__filename, '.js')
, debug = require('debug')('dm:contrib:' + basename)
, Segmenter = require('segmenter')
, XMLWriter = require('xml-writer')
, Transform = require("stream").Transform
;

function Command(options)
{
  Transform.call(this, options);

  this.begin = true;
  this.seg = new Segmenter({delimiter: options.delimiter});
  this.rootname =  options.rootname || 'root';
  this.rootattrs =  options.rootattrs || false;
  this.name = options.name || false;
  this.attrs = options.attrs || false;
  this.nodeclaration = options.nodeclaration || false;

  var self = this;
  this.xw = new XMLWriter(false, function (string, encoding) {
      self.push(string, encoding);
    }
  );
}

Command.prototype = Object.create(
  Transform.prototype, { constructor: { value: Command }});

Command.prototype.parse = function (lines, done) {
  var self = this;
  if (Array.isArray(lines)) {
    if (this.name) {
      lines.forEach(function (line) {
          if (line) {
            self.xw.startElement(self.name);
            if (self.attrs) {
              Object.keys(self.attrs).forEach(function (index) {
                  var item = self.attrs[index]
                  if (index.match(self.xw.name_regex)) {
                    self.xw.writeAttribute(index, item);
                  }
                }
              )
            }
            self.xw.text(line.trim()).endElement();
          }
        }
      );
    }
    else {
      this.xw.text(lines.join(this.seg.delimiter()));
    }
  }
  done();
}


Command.prototype._transform = function (chunk, encoding, done) {
  var self = this;
  if (self.begin) {
    self.begin = false;
    self.emit('begin');
    if (! self.nodeclaration) {
      self.xw.startDocument();
    }
    self.xw.startElement(self.rootname);
    if (self.rootattrs) {
      Object.keys(self.rootattrs).forEach(function (index) {
          var item = self.rootattrs[index]
          if (index.match(self.xw.name_regex)) {
            self.xw.writeAttribute(index, item);
          }
        }
      )
    }
    try {
      this.parse(this.seg.fetch(chunk, encoding), done);
    } catch (e) {
      done();
    }
  }
}
Command.prototype.end = function () {
  var self = this;
  self.parse(self.seg.fetch(), function () {
      self.xw.endElement();
      if (! self.nodeclaration) {
        self.xw.endDocument();
      }
      self.emit('end');
    }
  );
};

module.exports = function (options, si) {
  var cmd = new Command(options);
  return si.pipe(cmd);
}
