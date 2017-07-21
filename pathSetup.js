var path = require('path');
var fs = require('fs');

module.exports = function(filePath) {
  var orig, p, root;
  p = filePath || path.join(__filename, '../../');
  
  /**
   * P needs to be the 1st directory mentioned in filePath. Also, I
   * swapped this and the symbolic link dereference because if you
   * dereference before finding the directory, you may end up in a
   * very different directory than you intended.
   */
  p = (fs.lstatSync(p).isDirectory()) ? p : path.dirname(p);

  //Dereference all the way up!
  while (fs.lstatSync(p).isSymbolicLink()) {
    p = fs.readlinkSync(p);
  }
  
  //Get the original node path, or at least an empty string.
  orig = process.env.NODE_PATH || '';
  //Reset the NODE_PATH environment string.
  process.env.NODE_PATH = root + path.delimiter + orig;

  //Now, just re-initialize node's module paths.
  return require('module')._initPaths();
};

