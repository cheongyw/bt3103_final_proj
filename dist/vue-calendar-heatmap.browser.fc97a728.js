// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"node_modules/vue-calendar-heatmap/dist/vue-calendar-heatmap.browser.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var Buffer = require("buffer").Buffer;
!function(root,factory){"object"==typeof exports&&"object"==typeof module?module.exports=factory():"function"==typeof define&&define.amd?define([],factory):"object"==typeof exports?exports.VueCalendarHeatmap=factory():root.VueCalendarHeatmap=factory()}(this,function(){return function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={i:moduleId,l:!1,exports:{}};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.l=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.i=function(value){return value},__webpack_require__.d=function(exports,name,getter){__webpack_require__.o(exports,name)||Object.defineProperty(exports,name,{configurable:!1,enumerable:!0,get:getter})},__webpack_require__.n=function(module){var getter=module&&module.__esModule?function(){return module.default}:function(){return module};return __webpack_require__.d(getter,"a",getter),getter},__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=4)}([function(module,exports){var g,_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};g=function(){return this}();try{g=g||Function("return this")()||(0,eval)("this")}catch(e){"object"===("undefined"==typeof window?"undefined":_typeof(window))&&(g=window)}module.exports=g},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",function(){return DEFAULT_RANGE_COLOR}),__webpack_require__.d(__webpack_exports__,"e",function(){return DEFAULT_LOCALE}),__webpack_require__.d(__webpack_exports__,"b",function(){return DEFAULT_TOOLTIP_UNIT}),__webpack_require__.d(__webpack_exports__,"f",function(){return DAYS_IN_ONE_YEAR}),__webpack_require__.d(__webpack_exports__,"c",function(){return DAYS_IN_WEEK}),__webpack_require__.d(__webpack_exports__,"d",function(){return SQUARE_SIZE});var DEFAULT_RANGE_COLOR=["#ebedf0","#c0ddf9","#73b3f3","#3886e1","#17459e"],DEFAULT_LOCALE={months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],days:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],on:"on",less:"Less",more:"More"},DEFAULT_TOOLTIP_UNIT="contributions",DAYS_IN_ONE_YEAR=365,DAYS_IN_WEEK=7,SQUARE_SIZE=10},function(module,exports,__webpack_require__){__webpack_require__(8),__webpack_require__(7);var Component=__webpack_require__(9)(__webpack_require__(6),__webpack_require__(10),"data-v-a9cfea66",null);module.exports=Component.exports},function(module,__webpack_exports__,__webpack_require__){"use strict";function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var __WEBPACK_IMPORTED_MODULE_0__consts__=__webpack_require__(1),_createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),CalendarHeatmap=function(){function CalendarHeatmap(endDate,values,max){_classCallCheck(this,CalendarHeatmap),this.endDate=this._parseDate(endDate),this.max=max||Math.ceil(Math.max.apply(Math,_toConsumableArray(values.map(function(day){return day.count})))/5*4),this.startDate=this._shiftDate(endDate,-__WEBPACK_IMPORTED_MODULE_0__consts__.f),this.values=values}return _createClass(CalendarHeatmap,[{key:"getColorIndex",value:function(value){return value<=0?0:value>=this.max?4:Math.ceil(100*value/this.max*.03)}},{key:"getCountEmptyDaysAtStart",value:function(){return this.startDate.getDay()}},{key:"getCountEmptyDaysAtEnd",value:function(){return __WEBPACK_IMPORTED_MODULE_0__consts__.c-1-this.endDate.getDay()}},{key:"getDaysCount",value:function(){return __WEBPACK_IMPORTED_MODULE_0__consts__.f+1+this.getCountEmptyDaysAtStart()+this.getCountEmptyDaysAtEnd()}},{key:"_shiftDate",value:function(date,numDays){var newDate=new Date(date);return newDate.setDate(newDate.getDate()+numDays),newDate}},{key:"_parseDate",value:function(entry){return entry instanceof Date?entry:new Date(entry)}},{key:"_keyDayParser",value:function(date){var day=this._parseDate(date);return day.getFullYear()+"-"+day.getMonth()+"-"+day.getDate()}},{key:"activities",get:function(){var _this=this;return this.values.reduce(function(newValues,day){return newValues[_this._keyDayParser(day.date)]={count:day.count,colorIndex:_this.getColorIndex(day.count)},newValues},{})}},{key:"weekCount",get:function(){return this.getDaysCount()/__WEBPACK_IMPORTED_MODULE_0__consts__.c}},{key:"calendar",get:function(){var _this2=this,date=this._shiftDate(this.startDate,-this.getCountEmptyDaysAtStart());return Array.from({length:this.weekCount},function(){return Array.from({length:__WEBPACK_IMPORTED_MODULE_0__consts__.c},function(){var dDate=new Date(date.getFullYear(),date.getMonth(),date.getDate()),dayValues=_this2.activities[_this2._keyDayParser(dDate)];return date.setDate(date.getDate()+1),{date:dDate,count:dayValues?dayValues.count:0,colorIndex:dayValues?dayValues.colorIndex:0}})})}},{key:"firstFullWeekOfMonths",get:function(){return this.calendar.reduce(function(months,week,index,weeks){if(index>0){var lastWeek=weeks[index-1][0].date,currentWeek=week[0].date;(lastWeek.getFullYear()<currentWeek.getFullYear()||lastWeek.getMonth()<currentWeek.getMonth())&&months.push({value:currentWeek.getMonth(),index:index})}return months},[])}}]),CalendarHeatmap}();__webpack_exports__.a=CalendarHeatmap},function(module,__webpack_exports__,__webpack_require__){"use strict";Object.defineProperty(__webpack_exports__,"__esModule",{value:!0}),function(global){function install(Vue){Vue.component("calendarHeatmap",__WEBPACK_IMPORTED_MODULE_0__components_CalendarHeatmap_vue___default.a)}__webpack_exports__.install=install;var __WEBPACK_IMPORTED_MODULE_0__components_CalendarHeatmap_vue__=__webpack_require__(2),__WEBPACK_IMPORTED_MODULE_0__components_CalendarHeatmap_vue___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_CalendarHeatmap_vue__);__webpack_require__.d(__webpack_exports__,"CalendarHeatmap",function(){return __WEBPACK_IMPORTED_MODULE_0__components_CalendarHeatmap_vue___default.a});var plugin={version:"0.8.4",install:install};__webpack_exports__.default=plugin;var GlobalVue=null;"undefined"!=typeof window?GlobalVue=window.Vue:void 0!==global&&(GlobalVue=global.Vue),GlobalVue&&GlobalVue.use(plugin)}.call(__webpack_exports__,__webpack_require__(0))},function(module,__webpack_exports__,__webpack_require__){"use strict";(function(global){function microtaskDebounce(fn){var called=!1;return function(){called||(called=!0,window.Promise.resolve().then(function(){called=!1,fn()}))}}function taskDebounce(fn){var scheduled=!1;return function(){scheduled||(scheduled=!0,setTimeout(function(){scheduled=!1,fn()},timeoutDuration))}}function isFunction(functionToCheck){var getType={};return functionToCheck&&"[object Function]"===getType.toString.call(functionToCheck)}function getStyleComputedProperty(element,property){if(1!==element.nodeType)return[];var css=getComputedStyle(element,null);return property?css[property]:css}function getParentNode(element){return"HTML"===element.nodeName?element:element.parentNode||element.host}function getScrollParent(element){if(!element)return document.body;switch(element.nodeName){case"HTML":case"BODY":return element.ownerDocument.body;case"#document":return element.body}var _getStyleComputedProp=getStyleComputedProperty(element),overflow=_getStyleComputedProp.overflow,overflowX=_getStyleComputedProp.overflowX;return/(auto|scroll|overlay)/.test(overflow+_getStyleComputedProp.overflowY+overflowX)?element:getScrollParent(getParentNode(element))}function isIE(version){return 11===version?isIE11:10===version?isIE10:isIE11||isIE10}function getOffsetParent(element){if(!element)return document.documentElement;for(var noOffsetParent=isIE(10)?document.body:null,offsetParent=element.offsetParent;offsetParent===noOffsetParent&&element.nextElementSibling;)offsetParent=(element=element.nextElementSibling).offsetParent;var nodeName=offsetParent&&offsetParent.nodeName;return nodeName&&"BODY"!==nodeName&&"HTML"!==nodeName?-1!==["TD","TABLE"].indexOf(offsetParent.nodeName)&&"static"===getStyleComputedProperty(offsetParent,"position")?getOffsetParent(offsetParent):offsetParent:element?element.ownerDocument.documentElement:document.documentElement}function isOffsetContainer(element){var nodeName=element.nodeName;return"BODY"!==nodeName&&("HTML"===nodeName||getOffsetParent(element.firstElementChild)===element)}function getRoot(node){return null!==node.parentNode?getRoot(node.parentNode):node}function findCommonOffsetParent(element1,element2){if(!(element1&&element1.nodeType&&element2&&element2.nodeType))return document.documentElement;var order=element1.compareDocumentPosition(element2)&Node.DOCUMENT_POSITION_FOLLOWING,start=order?element1:element2,end=order?element2:element1,range=document.createRange();range.setStart(start,0),range.setEnd(end,0);var commonAncestorContainer=range.commonAncestorContainer;if(element1!==commonAncestorContainer&&element2!==commonAncestorContainer||start.contains(end))return isOffsetContainer(commonAncestorContainer)?commonAncestorContainer:getOffsetParent(commonAncestorContainer);var element1root=getRoot(element1);return element1root.host?findCommonOffsetParent(element1root.host,element2):findCommonOffsetParent(element1,getRoot(element2).host)}function getScroll(element){var side=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top",upperSide="top"===side?"scrollTop":"scrollLeft",nodeName=element.nodeName;if("BODY"===nodeName||"HTML"===nodeName){var html=element.ownerDocument.documentElement;return(element.ownerDocument.scrollingElement||html)[upperSide]}return element[upperSide]}function includeScroll(rect,element){var subtract=arguments.length>2&&void 0!==arguments[2]&&arguments[2],scrollTop=getScroll(element,"top"),scrollLeft=getScroll(element,"left"),modifier=subtract?-1:1;return rect.top+=scrollTop*modifier,rect.bottom+=scrollTop*modifier,rect.left+=scrollLeft*modifier,rect.right+=scrollLeft*modifier,rect}function getBordersSize(styles,axis){var sideA="x"===axis?"Left":"Top",sideB="Left"===sideA?"Right":"Bottom";return parseFloat(styles["border"+sideA+"Width"],10)+parseFloat(styles["border"+sideB+"Width"],10)}function getSize(axis,body,html,computedStyle){return Math.max(body["offset"+axis],body["scroll"+axis],html["client"+axis],html["offset"+axis],html["scroll"+axis],isIE(10)?html["offset"+axis]+computedStyle["margin"+("Height"===axis?"Top":"Left")]+computedStyle["margin"+("Height"===axis?"Bottom":"Right")]:0)}function getWindowSizes(){var body=document.body,html=document.documentElement,computedStyle=isIE(10)&&getComputedStyle(html);return{height:getSize("Height",body,html,computedStyle),width:getSize("Width",body,html,computedStyle)}}function getClientRect(offsets){return _extends({},offsets,{right:offsets.left+offsets.width,bottom:offsets.top+offsets.height})}function getBoundingClientRect(element){var rect={};try{if(isIE(10)){rect=element.getBoundingClientRect();var scrollTop=getScroll(element,"top"),scrollLeft=getScroll(element,"left");rect.top+=scrollTop,rect.left+=scrollLeft,rect.bottom+=scrollTop,rect.right+=scrollLeft}else rect=element.getBoundingClientRect()}catch(e){}var result={left:rect.left,top:rect.top,width:rect.right-rect.left,height:rect.bottom-rect.top},sizes="HTML"===element.nodeName?getWindowSizes():{},width=sizes.width||element.clientWidth||result.right-result.left,height=sizes.height||element.clientHeight||result.bottom-result.top,horizScrollbar=element.offsetWidth-width,vertScrollbar=element.offsetHeight-height;if(horizScrollbar||vertScrollbar){var styles=getStyleComputedProperty(element);horizScrollbar-=getBordersSize(styles,"x"),vertScrollbar-=getBordersSize(styles,"y"),result.width-=horizScrollbar,result.height-=vertScrollbar}return getClientRect(result)}function getOffsetRectRelativeToArbitraryNode(children,parent){var fixedPosition=arguments.length>2&&void 0!==arguments[2]&&arguments[2],isIE10=isIE(10),isHTML="HTML"===parent.nodeName,childrenRect=getBoundingClientRect(children),parentRect=getBoundingClientRect(parent),scrollParent=getScrollParent(children),styles=getStyleComputedProperty(parent),borderTopWidth=parseFloat(styles.borderTopWidth,10),borderLeftWidth=parseFloat(styles.borderLeftWidth,10);fixedPosition&&"HTML"===parent.nodeName&&(parentRect.top=Math.max(parentRect.top,0),parentRect.left=Math.max(parentRect.left,0));var offsets=getClientRect({top:childrenRect.top-parentRect.top-borderTopWidth,left:childrenRect.left-parentRect.left-borderLeftWidth,width:childrenRect.width,height:childrenRect.height});if(offsets.marginTop=0,offsets.marginLeft=0,!isIE10&&isHTML){var marginTop=parseFloat(styles.marginTop,10),marginLeft=parseFloat(styles.marginLeft,10);offsets.top-=borderTopWidth-marginTop,offsets.bottom-=borderTopWidth-marginTop,offsets.left-=borderLeftWidth-marginLeft,offsets.right-=borderLeftWidth-marginLeft,offsets.marginTop=marginTop,offsets.marginLeft=marginLeft}return(isIE10&&!fixedPosition?parent.contains(scrollParent):parent===scrollParent&&"BODY"!==scrollParent.nodeName)&&(offsets=includeScroll(offsets,parent)),offsets}function getViewportOffsetRectRelativeToArtbitraryNode(element){var excludeScroll=arguments.length>1&&void 0!==arguments[1]&&arguments[1],html=element.ownerDocument.documentElement,relativeOffset=getOffsetRectRelativeToArbitraryNode(element,html),width=Math.max(html.clientWidth,window.innerWidth||0),height=Math.max(html.clientHeight,window.innerHeight||0),scrollTop=excludeScroll?0:getScroll(html),scrollLeft=excludeScroll?0:getScroll(html,"left");return getClientRect({top:scrollTop-relativeOffset.top+relativeOffset.marginTop,left:scrollLeft-relativeOffset.left+relativeOffset.marginLeft,width:width,height:height})}function isFixed(element){var nodeName=element.nodeName;return"BODY"!==nodeName&&"HTML"!==nodeName&&("fixed"===getStyleComputedProperty(element,"position")||isFixed(getParentNode(element)))}function getFixedPositionOffsetParent(element){if(!element||!element.parentElement||isIE())return document.documentElement;for(var el=element.parentElement;el&&"none"===getStyleComputedProperty(el,"transform");)el=el.parentElement;return el||document.documentElement}function getBoundaries(popper,reference,padding,boundariesElement){var fixedPosition=arguments.length>4&&void 0!==arguments[4]&&arguments[4],boundaries={top:0,left:0},offsetParent=fixedPosition?getFixedPositionOffsetParent(popper):findCommonOffsetParent(popper,reference);if("viewport"===boundariesElement)boundaries=getViewportOffsetRectRelativeToArtbitraryNode(offsetParent,fixedPosition);else{var boundariesNode=void 0;"scrollParent"===boundariesElement?(boundariesNode=getScrollParent(getParentNode(reference)),"BODY"===boundariesNode.nodeName&&(boundariesNode=popper.ownerDocument.documentElement)):boundariesNode="window"===boundariesElement?popper.ownerDocument.documentElement:boundariesElement;var offsets=getOffsetRectRelativeToArbitraryNode(boundariesNode,offsetParent,fixedPosition);if("HTML"!==boundariesNode.nodeName||isFixed(offsetParent))boundaries=offsets;else{var _getWindowSizes=getWindowSizes(),height=_getWindowSizes.height,width=_getWindowSizes.width;boundaries.top+=offsets.top-offsets.marginTop,boundaries.bottom=height+offsets.top,boundaries.left+=offsets.left-offsets.marginLeft,boundaries.right=width+offsets.left}}return boundaries.left+=padding,boundaries.top+=padding,boundaries.right-=padding,boundaries.bottom-=padding,boundaries}function getArea(_ref){return _ref.width*_ref.height}function computeAutoPlacement(placement,refRect,popper,reference,boundariesElement){var padding=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;if(-1===placement.indexOf("auto"))return placement;var boundaries=getBoundaries(popper,reference,padding,boundariesElement),rects={top:{width:boundaries.width,height:refRect.top-boundaries.top},right:{width:boundaries.right-refRect.right,height:boundaries.height},bottom:{width:boundaries.width,height:boundaries.bottom-refRect.bottom},left:{width:refRect.left-boundaries.left,height:boundaries.height}},sortedAreas=Object.keys(rects).map(function(key){return _extends({key:key},rects[key],{area:getArea(rects[key])})}).sort(function(a,b){return b.area-a.area}),filteredAreas=sortedAreas.filter(function(_ref2){var width=_ref2.width,height=_ref2.height;return width>=popper.clientWidth&&height>=popper.clientHeight}),computedPlacement=filteredAreas.length>0?filteredAreas[0].key:sortedAreas[0].key,variation=placement.split("-")[1];return computedPlacement+(variation?"-"+variation:"")}function getReferenceOffsets(state,popper,reference){var fixedPosition=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;return getOffsetRectRelativeToArbitraryNode(reference,fixedPosition?getFixedPositionOffsetParent(popper):findCommonOffsetParent(popper,reference),fixedPosition)}function getOuterSizes(element){var styles=getComputedStyle(element),x=parseFloat(styles.marginTop)+parseFloat(styles.marginBottom),y=parseFloat(styles.marginLeft)+parseFloat(styles.marginRight);return{width:element.offsetWidth+y,height:element.offsetHeight+x}}function getOppositePlacement(placement){var hash={left:"right",right:"left",bottom:"top",top:"bottom"};return placement.replace(/left|right|bottom|top/g,function(matched){return hash[matched]})}function getPopperOffsets(popper,referenceOffsets,placement){placement=placement.split("-")[0];var popperRect=getOuterSizes(popper),popperOffsets={width:popperRect.width,height:popperRect.height},isHoriz=-1!==["right","left"].indexOf(placement),mainSide=isHoriz?"top":"left",secondarySide=isHoriz?"left":"top",measurement=isHoriz?"height":"width",secondaryMeasurement=isHoriz?"width":"height";return popperOffsets[mainSide]=referenceOffsets[mainSide]+referenceOffsets[measurement]/2-popperRect[measurement]/2,popperOffsets[secondarySide]=placement===secondarySide?referenceOffsets[secondarySide]-popperRect[secondaryMeasurement]:referenceOffsets[getOppositePlacement(secondarySide)],popperOffsets}function find(arr,check){return Array.prototype.find?arr.find(check):arr.filter(check)[0]}function findIndex(arr,prop,value){if(Array.prototype.findIndex)return arr.findIndex(function(cur){return cur[prop]===value});var match=find(arr,function(obj){return obj[prop]===value});return arr.indexOf(match)}function runModifiers(modifiers,data,ends){return(void 0===ends?modifiers:modifiers.slice(0,findIndex(modifiers,"name",ends))).forEach(function(modifier){modifier.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var fn=modifier.function||modifier.fn;modifier.enabled&&isFunction(fn)&&(data.offsets.popper=getClientRect(data.offsets.popper),data.offsets.reference=getClientRect(data.offsets.reference),data=fn(data,modifier))}),data}function update(){if(!this.state.isDestroyed){var data={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};data.offsets.reference=getReferenceOffsets(this.state,this.popper,this.reference,this.options.positionFixed),data.placement=computeAutoPlacement(this.options.placement,data.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),data.originalPlacement=data.placement,data.positionFixed=this.options.positionFixed,data.offsets.popper=getPopperOffsets(this.popper,data.offsets.reference,data.placement),data.offsets.popper.position=this.options.positionFixed?"fixed":"absolute",data=runModifiers(this.modifiers,data),this.state.isCreated?this.options.onUpdate(data):(this.state.isCreated=!0,this.options.onCreate(data))}}function isModifierEnabled(modifiers,modifierName){return modifiers.some(function(_ref){var name=_ref.name;return _ref.enabled&&name===modifierName})}function getSupportedPropertyName(property){for(var prefixes=[!1,"ms","Webkit","Moz","O"],upperProp=property.charAt(0).toUpperCase()+property.slice(1),i=0;i<prefixes.length;i++){var prefix=prefixes[i],toCheck=prefix?""+prefix+upperProp:property;if(void 0!==document.body.style[toCheck])return toCheck}return null}function destroy(){return this.state.isDestroyed=!0,isModifierEnabled(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.position="",this.popper.style.top="",this.popper.style.left="",this.popper.style.right="",this.popper.style.bottom="",this.popper.style.willChange="",this.popper.style[getSupportedPropertyName("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function getWindow(element){var ownerDocument=element.ownerDocument;return ownerDocument?ownerDocument.defaultView:window}function attachToScrollParents(scrollParent,event,callback,scrollParents){var isBody="BODY"===scrollParent.nodeName,target=isBody?scrollParent.ownerDocument.defaultView:scrollParent;target.addEventListener(event,callback,{passive:!0}),isBody||attachToScrollParents(getScrollParent(target.parentNode),event,callback,scrollParents),scrollParents.push(target)}function setupEventListeners(reference,options,state,updateBound){state.updateBound=updateBound,getWindow(reference).addEventListener("resize",state.updateBound,{passive:!0});var scrollElement=getScrollParent(reference);return attachToScrollParents(scrollElement,"scroll",state.updateBound,state.scrollParents),state.scrollElement=scrollElement,state.eventsEnabled=!0,state}function enableEventListeners(){this.state.eventsEnabled||(this.state=setupEventListeners(this.reference,this.options,this.state,this.scheduleUpdate))}function removeEventListeners(reference,state){return getWindow(reference).removeEventListener("resize",state.updateBound),state.scrollParents.forEach(function(target){target.removeEventListener("scroll",state.updateBound)}),state.updateBound=null,state.scrollParents=[],state.scrollElement=null,state.eventsEnabled=!1,state}function disableEventListeners(){this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=removeEventListeners(this.reference,this.state))}function isNumeric(n){return""!==n&&!isNaN(parseFloat(n))&&isFinite(n)}function setStyles(element,styles){Object.keys(styles).forEach(function(prop){var unit="";-1!==["width","height","top","right","bottom","left"].indexOf(prop)&&isNumeric(styles[prop])&&(unit="px"),element.style[prop]=styles[prop]+unit})}function setAttributes(element,attributes){Object.keys(attributes).forEach(function(prop){!1!==attributes[prop]?element.setAttribute(prop,attributes[prop]):element.removeAttribute(prop)})}function applyStyle(data){return setStyles(data.instance.popper,data.styles),setAttributes(data.instance.popper,data.attributes),data.arrowElement&&Object.keys(data.arrowStyles).length&&setStyles(data.arrowElement,data.arrowStyles),data}function applyStyleOnLoad(reference,popper,options,modifierOptions,state){var referenceOffsets=getReferenceOffsets(state,popper,reference,options.positionFixed),placement=computeAutoPlacement(options.placement,referenceOffsets,popper,reference,options.modifiers.flip.boundariesElement,options.modifiers.flip.padding);return popper.setAttribute("x-placement",placement),setStyles(popper,{position:options.positionFixed?"fixed":"absolute"}),options}function computeStyle(data,options){var x=options.x,y=options.y,popper=data.offsets.popper,legacyGpuAccelerationOption=find(data.instance.modifiers,function(modifier){return"applyStyle"===modifier.name}).gpuAcceleration;void 0!==legacyGpuAccelerationOption&&console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");var gpuAcceleration=void 0!==legacyGpuAccelerationOption?legacyGpuAccelerationOption:options.gpuAcceleration,offsetParent=getOffsetParent(data.instance.popper),offsetParentRect=getBoundingClientRect(offsetParent),styles={position:popper.position},offsets={left:Math.floor(popper.left),top:Math.round(popper.top),bottom:Math.round(popper.bottom),right:Math.floor(popper.right)},sideA="bottom"===x?"top":"bottom",sideB="right"===y?"left":"right",prefixedProperty=getSupportedPropertyName("transform"),left=void 0,top=void 0;if(top="bottom"===sideA?-offsetParentRect.height+offsets.bottom:offsets.top,left="right"===sideB?-offsetParentRect.width+offsets.right:offsets.left,gpuAcceleration&&prefixedProperty)styles[prefixedProperty]="translate3d("+left+"px, "+top+"px, 0)",styles[sideA]=0,styles[sideB]=0,styles.willChange="transform";else{var invertTop="bottom"===sideA?-1:1,invertLeft="right"===sideB?-1:1;styles[sideA]=top*invertTop,styles[sideB]=left*invertLeft,styles.willChange=sideA+", "+sideB}var attributes={"x-placement":data.placement};return data.attributes=_extends({},attributes,data.attributes),data.styles=_extends({},styles,data.styles),data.arrowStyles=_extends({},data.offsets.arrow,data.arrowStyles),data}function isModifierRequired(modifiers,requestingName,requestedName){var requesting=find(modifiers,function(_ref){return _ref.name===requestingName}),isRequired=!!requesting&&modifiers.some(function(modifier){return modifier.name===requestedName&&modifier.enabled&&modifier.order<requesting.order});if(!isRequired){var _requesting="`"+requestingName+"`",requested="`"+requestedName+"`";console.warn(requested+" modifier is required by "+_requesting+" modifier in order to work, be sure to include it before "+_requesting+"!")}return isRequired}function arrow(data,options){var _data$offsets$arrow;if(!isModifierRequired(data.instance.modifiers,"arrow","keepTogether"))return data;var arrowElement=options.element;if("string"==typeof arrowElement){if(!(arrowElement=data.instance.popper.querySelector(arrowElement)))return data}else if(!data.instance.popper.contains(arrowElement))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),data;var placement=data.placement.split("-")[0],_data$offsets=data.offsets,popper=_data$offsets.popper,reference=_data$offsets.reference,isVertical=-1!==["left","right"].indexOf(placement),len=isVertical?"height":"width",sideCapitalized=isVertical?"Top":"Left",side=sideCapitalized.toLowerCase(),altSide=isVertical?"left":"top",opSide=isVertical?"bottom":"right",arrowElementSize=getOuterSizes(arrowElement)[len];reference[opSide]-arrowElementSize<popper[side]&&(data.offsets.popper[side]-=popper[side]-(reference[opSide]-arrowElementSize)),reference[side]+arrowElementSize>popper[opSide]&&(data.offsets.popper[side]+=reference[side]+arrowElementSize-popper[opSide]),data.offsets.popper=getClientRect(data.offsets.popper);var center=reference[side]+reference[len]/2-arrowElementSize/2,css=getStyleComputedProperty(data.instance.popper),popperMarginSide=parseFloat(css["margin"+sideCapitalized],10),popperBorderSide=parseFloat(css["border"+sideCapitalized+"Width"],10),sideValue=center-data.offsets.popper[side]-popperMarginSide-popperBorderSide;return sideValue=Math.max(Math.min(popper[len]-arrowElementSize,sideValue),0),data.arrowElement=arrowElement,data.offsets.arrow=(_data$offsets$arrow={},defineProperty(_data$offsets$arrow,side,Math.round(sideValue)),defineProperty(_data$offsets$arrow,altSide,""),_data$offsets$arrow),data}function getOppositeVariation(variation){return"end"===variation?"start":"start"===variation?"end":variation}function clockwise(placement){var counter=arguments.length>1&&void 0!==arguments[1]&&arguments[1],index=validPlacements.indexOf(placement),arr=validPlacements.slice(index+1).concat(validPlacements.slice(0,index));return counter?arr.reverse():arr}function flip(data,options){if(isModifierEnabled(data.instance.modifiers,"inner"))return data;if(data.flipped&&data.placement===data.originalPlacement)return data;var boundaries=getBoundaries(data.instance.popper,data.instance.reference,options.padding,options.boundariesElement,data.positionFixed),placement=data.placement.split("-")[0],placementOpposite=getOppositePlacement(placement),variation=data.placement.split("-")[1]||"",flipOrder=[];switch(options.behavior){case BEHAVIORS.FLIP:flipOrder=[placement,placementOpposite];break;case BEHAVIORS.CLOCKWISE:flipOrder=clockwise(placement);break;case BEHAVIORS.COUNTERCLOCKWISE:flipOrder=clockwise(placement,!0);break;default:flipOrder=options.behavior}return flipOrder.forEach(function(step,index){if(placement!==step||flipOrder.length===index+1)return data;placement=data.placement.split("-")[0],placementOpposite=getOppositePlacement(placement);var popperOffsets=data.offsets.popper,refOffsets=data.offsets.reference,floor=Math.floor,overlapsRef="left"===placement&&floor(popperOffsets.right)>floor(refOffsets.left)||"right"===placement&&floor(popperOffsets.left)<floor(refOffsets.right)||"top"===placement&&floor(popperOffsets.bottom)>floor(refOffsets.top)||"bottom"===placement&&floor(popperOffsets.top)<floor(refOffsets.bottom),overflowsLeft=floor(popperOffsets.left)<floor(boundaries.left),overflowsRight=floor(popperOffsets.right)>floor(boundaries.right),overflowsTop=floor(popperOffsets.top)<floor(boundaries.top),overflowsBottom=floor(popperOffsets.bottom)>floor(boundaries.bottom),overflowsBoundaries="left"===placement&&overflowsLeft||"right"===placement&&overflowsRight||"top"===placement&&overflowsTop||"bottom"===placement&&overflowsBottom,isVertical=-1!==["top","bottom"].indexOf(placement),flippedVariation=!!options.flipVariations&&(isVertical&&"start"===variation&&overflowsLeft||isVertical&&"end"===variation&&overflowsRight||!isVertical&&"start"===variation&&overflowsTop||!isVertical&&"end"===variation&&overflowsBottom);(overlapsRef||overflowsBoundaries||flippedVariation)&&(data.flipped=!0,(overlapsRef||overflowsBoundaries)&&(placement=flipOrder[index+1]),flippedVariation&&(variation=getOppositeVariation(variation)),data.placement=placement+(variation?"-"+variation:""),data.offsets.popper=_extends({},data.offsets.popper,getPopperOffsets(data.instance.popper,data.offsets.reference,data.placement)),data=runModifiers(data.instance.modifiers,data,"flip"))}),data}function keepTogether(data){var _data$offsets=data.offsets,popper=_data$offsets.popper,reference=_data$offsets.reference,placement=data.placement.split("-")[0],floor=Math.floor,isVertical=-1!==["top","bottom"].indexOf(placement),side=isVertical?"right":"bottom",opSide=isVertical?"left":"top",measurement=isVertical?"width":"height";return popper[side]<floor(reference[opSide])&&(data.offsets.popper[opSide]=floor(reference[opSide])-popper[measurement]),popper[opSide]>floor(reference[side])&&(data.offsets.popper[opSide]=floor(reference[side])),data}function toValue(str,measurement,popperOffsets,referenceOffsets){var split=str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),value=+split[1],unit=split[2];if(!value)return str;if(0===unit.indexOf("%")){var element=void 0;switch(unit){case"%p":element=popperOffsets;break;case"%":case"%r":default:element=referenceOffsets}return getClientRect(element)[measurement]/100*value}if("vh"===unit||"vw"===unit){return("vh"===unit?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*value}return value}function parseOffset(offset,popperOffsets,referenceOffsets,basePlacement){var offsets=[0,0],useHeight=-1!==["right","left"].indexOf(basePlacement),fragments=offset.split(/(\+|\-)/).map(function(frag){return frag.trim()}),divider=fragments.indexOf(find(fragments,function(frag){return-1!==frag.search(/,|\s/)}));fragments[divider]&&-1===fragments[divider].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");var splitRegex=/\s*,\s*|\s+/,ops=-1!==divider?[fragments.slice(0,divider).concat([fragments[divider].split(splitRegex)[0]]),[fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider+1))]:[fragments];return ops=ops.map(function(op,index){var measurement=(1===index?!useHeight:useHeight)?"height":"width",mergeWithPrevious=!1;return op.reduce(function(a,b){return""===a[a.length-1]&&-1!==["+","-"].indexOf(b)?(a[a.length-1]=b,mergeWithPrevious=!0,a):mergeWithPrevious?(a[a.length-1]+=b,mergeWithPrevious=!1,a):a.concat(b)},[]).map(function(str){return toValue(str,measurement,popperOffsets,referenceOffsets)})}),ops.forEach(function(op,index){op.forEach(function(frag,index2){isNumeric(frag)&&(offsets[index]+=frag*("-"===op[index2-1]?-1:1))})}),offsets}function offset(data,_ref){var offset=_ref.offset,placement=data.placement,_data$offsets=data.offsets,popper=_data$offsets.popper,reference=_data$offsets.reference,basePlacement=placement.split("-")[0],offsets=void 0;return offsets=isNumeric(+offset)?[+offset,0]:parseOffset(offset,popper,reference,basePlacement),"left"===basePlacement?(popper.top+=offsets[0],popper.left-=offsets[1]):"right"===basePlacement?(popper.top+=offsets[0],popper.left+=offsets[1]):"top"===basePlacement?(popper.left+=offsets[0],popper.top-=offsets[1]):"bottom"===basePlacement&&(popper.left+=offsets[0],popper.top+=offsets[1]),data.popper=popper,data}function preventOverflow(data,options){var boundariesElement=options.boundariesElement||getOffsetParent(data.instance.popper);data.instance.reference===boundariesElement&&(boundariesElement=getOffsetParent(boundariesElement));var transformProp=getSupportedPropertyName("transform"),popperStyles=data.instance.popper.style,top=popperStyles.top,left=popperStyles.left,transform=popperStyles[transformProp];popperStyles.top="",popperStyles.left="",popperStyles[transformProp]="";var boundaries=getBoundaries(data.instance.popper,data.instance.reference,options.padding,boundariesElement,data.positionFixed);popperStyles.top=top,popperStyles.left=left,popperStyles[transformProp]=transform,options.boundaries=boundaries;var order=options.priority,popper=data.offsets.popper,check={primary:function(placement){var value=popper[placement];return popper[placement]<boundaries[placement]&&!options.escapeWithReference&&(value=Math.max(popper[placement],boundaries[placement])),defineProperty({},placement,value)},secondary:function(placement){var mainSide="right"===placement?"left":"top",value=popper[mainSide];return popper[placement]>boundaries[placement]&&!options.escapeWithReference&&(value=Math.min(popper[mainSide],boundaries[placement]-("right"===placement?popper.width:popper.height))),defineProperty({},mainSide,value)}};return order.forEach(function(placement){var side=-1!==["left","top"].indexOf(placement)?"primary":"secondary";popper=_extends({},popper,check[side](placement))}),data.offsets.popper=popper,data}function shift(data){var placement=data.placement,basePlacement=placement.split("-")[0],shiftvariation=placement.split("-")[1];if(shiftvariation){var _data$offsets=data.offsets,reference=_data$offsets.reference,popper=_data$offsets.popper,isVertical=-1!==["bottom","top"].indexOf(basePlacement),side=isVertical?"left":"top",measurement=isVertical?"width":"height",shiftOffsets={start:defineProperty({},side,reference[side]),end:defineProperty({},side,reference[side]+reference[measurement]-popper[measurement])};data.offsets.popper=_extends({},popper,shiftOffsets[shiftvariation])}return data}function hide(data){if(!isModifierRequired(data.instance.modifiers,"hide","preventOverflow"))return data;var refRect=data.offsets.reference,bound=find(data.instance.modifiers,function(modifier){return"preventOverflow"===modifier.name}).boundaries;if(refRect.bottom<bound.top||refRect.left>bound.right||refRect.top>bound.bottom||refRect.right<bound.left){if(!0===data.hide)return data;data.hide=!0,data.attributes["x-out-of-boundaries"]=""}else{if(!1===data.hide)return data;data.hide=!1,data.attributes["x-out-of-boundaries"]=!1}return data}function inner(data){var placement=data.placement,basePlacement=placement.split("-")[0],_data$offsets=data.offsets,popper=_data$offsets.popper,reference=_data$offsets.reference,isHoriz=-1!==["left","right"].indexOf(basePlacement),subtractLength=-1===["top","left"].indexOf(basePlacement);return popper[isHoriz?"left":"top"]=reference[basePlacement]-(subtractLength?popper[isHoriz?"width":"height"]:0),data.placement=getOppositePlacement(placement),data.offsets.popper=getClientRect(popper),data}function convertToArray(value){return"string"==typeof value&&(value=value.split(" ")),value}function addClasses(el,classes){var newClasses=convertToArray(classes),classList=void 0;classList=convertToArray(el.className instanceof SVGAnimatedString?el.className.baseVal:el.className),newClasses.forEach(function(newClass){-1===classList.indexOf(newClass)&&classList.push(newClass)}),el instanceof SVGElement?el.setAttribute("class",classList.join(" ")):el.className=classList.join(" ")}function removeClasses(el,classes){var newClasses=convertToArray(classes),classList=void 0;classList=convertToArray(el.className instanceof SVGAnimatedString?el.className.baseVal:el.className),newClasses.forEach(function(newClass){var index=classList.indexOf(newClass);-1!==index&&classList.splice(index,1)}),el instanceof SVGElement?el.setAttribute("class",classList.join(" ")):el.className=classList.join(" ")}function getOptions(options){var result={placement:void 0!==options.placement?options.placement:directive.options.defaultPlacement,delay:void 0!==options.delay?options.delay:directive.options.defaultDelay,html:void 0!==options.html?options.html:directive.options.defaultHtml,template:void 0!==options.template?options.template:directive.options.defaultTemplate,arrowSelector:void 0!==options.arrowSelector?options.arrowSelector:directive.options.defaultArrowSelector,innerSelector:void 0!==options.innerSelector?options.innerSelector:directive.options.defaultInnerSelector,trigger:void 0!==options.trigger?options.trigger:directive.options.defaultTrigger,offset:void 0!==options.offset?options.offset:directive.options.defaultOffset,container:void 0!==options.container?options.container:directive.options.defaultContainer,boundariesElement:void 0!==options.boundariesElement?options.boundariesElement:directive.options.defaultBoundariesElement,autoHide:void 0!==options.autoHide?options.autoHide:directive.options.autoHide,hideOnTargetClick:void 0!==options.hideOnTargetClick?options.hideOnTargetClick:directive.options.defaultHideOnTargetClick,loadingClass:void 0!==options.loadingClass?options.loadingClass:directive.options.defaultLoadingClass,loadingContent:void 0!==options.loadingContent?options.loadingContent:directive.options.defaultLoadingContent,popperOptions:_extends$1({},void 0!==options.popperOptions?options.popperOptions:directive.options.defaultPopperOptions)};if(result.offset){var typeofOffset=_typeof(result.offset),offset=result.offset;("number"===typeofOffset||"string"===typeofOffset&&-1===offset.indexOf(","))&&(offset="0, "+offset),result.popperOptions.modifiers||(result.popperOptions.modifiers={}),result.popperOptions.modifiers.offset={offset:offset}}return result}function getPlacement(value,modifiers){for(var placement=value.placement,i=0;i<positions.length;i++){var pos=positions[i];modifiers[pos]&&(placement=pos)}return placement}function getContent(value){var type=void 0===value?"undefined":_typeof(value);return"string"===type?value:!(!value||"object"!==type)&&value.content}function createTooltip(el,value){var modifiers=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},content=getContent(value),classes=void 0!==value.classes?value.classes:directive.options.defaultClass,opts=_extends$1({title:content},getOptions(_extends$1({},value,{placement:getPlacement(value,modifiers)}))),tooltip=el._tooltip=new Tooltip(el,opts);tooltip.setClasses(classes),tooltip._vueEl=el;var targetClasses=void 0!==value.targetClasses?value.targetClasses:directive.options.defaultTargetClass;return el._tooltipTargetClasses=targetClasses,addClasses(el,targetClasses),tooltip}function destroyTooltip(el){el._tooltip&&(el._tooltip.dispose(),delete el._tooltip,delete el._tooltipOldShow),el._tooltipTargetClasses&&(removeClasses(el,el._tooltipTargetClasses),delete el._tooltipTargetClasses)}function bind(el,_ref){var value=_ref.value,modifiers=(_ref.oldValue,_ref.modifiers),content=getContent(value);if(content&&state.enabled){var tooltip=void 0;el._tooltip?(tooltip=el._tooltip,tooltip.setContent(content),tooltip.setOptions(_extends$1({},value,{placement:getPlacement(value,modifiers)}))):tooltip=createTooltip(el,value,modifiers),void 0!==value.show&&value.show!==el._tooltipOldShow&&(el._tooltipOldShow=value.show,value.show?tooltip.show():tooltip.hide())}else destroyTooltip(el)}function addListeners(el){el.addEventListener("click",onClick),el.addEventListener("touchstart",onTouchStart,!!supportsPassive&&{passive:!0})}function removeListeners(el){el.removeEventListener("click",onClick),el.removeEventListener("touchstart",onTouchStart),el.removeEventListener("touchend",onTouchEnd),el.removeEventListener("touchcancel",onTouchCancel)}function onClick(event){var el=event.currentTarget;event.closePopover=!el.$_vclosepopover_touch,event.closeAllPopover=el.$_closePopoverModifiers&&!!el.$_closePopoverModifiers.all}function onTouchStart(event){if(1===event.changedTouches.length){var el=event.currentTarget;el.$_vclosepopover_touch=!0;var touch=event.changedTouches[0];el.$_vclosepopover_touchPoint=touch,el.addEventListener("touchend",onTouchEnd),el.addEventListener("touchcancel",onTouchCancel)}}function onTouchEnd(event){var el=event.currentTarget;if(el.$_vclosepopover_touch=!1,1===event.changedTouches.length){var touch=event.changedTouches[0],firstTouch=el.$_vclosepopover_touchPoint;event.closePopover=Math.abs(touch.screenY-firstTouch.screenY)<20&&Math.abs(touch.screenX-firstTouch.screenX)<20,event.closeAllPopover=el.$_closePopoverModifiers&&!!el.$_closePopoverModifiers.all}}function onTouchCancel(event){event.currentTarget.$_vclosepopover_touch=!1}function getInternetExplorerVersion(){var ua=window.navigator.userAgent,msie=ua.indexOf("MSIE ");if(msie>0)return parseInt(ua.substring(msie+5,ua.indexOf(".",msie)),10);if(ua.indexOf("Trident/")>0){var rv=ua.indexOf("rv:");return parseInt(ua.substring(rv+3,ua.indexOf(".",rv)),10)}var edge=ua.indexOf("Edge/");return edge>0?parseInt(ua.substring(edge+5,ua.indexOf(".",edge)),10):-1}function initCompat(){initCompat.init||(initCompat.init=!0,isIE$1=-1!==getInternetExplorerVersion())}function install$1(Vue){Vue.component("resize-observer",ResizeObserver)}function getDefault(key){var value=directive.options.popover[key];return void 0===value?directive.options[key]:value}function handleGlobalClick(event){handleGlobalClose(event)}function handleGlobalTouchend(event){handleGlobalClose(event,!0)}function handleGlobalClose(event){var touch=arguments.length>1&&void 0!==arguments[1]&&arguments[1];requestAnimationFrame(function(){for(var popover=void 0,i=0;i<openPopovers.length;i++)if(popover=openPopovers[i],popover.$refs.popover){var contains=popover.$refs.popover.contains(event.target);(event.closeAllPopover||event.closePopover&&contains||popover.autoHide&&!contains)&&popover.$_handleGlobalClose(event,touch)}})}function install(Vue){var options=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!install.installed){install.installed=!0;var finalOptions={};lodash_merge(finalOptions,defaultOptions,options),plugin.options=finalOptions,directive.options=finalOptions,Vue.directive("tooltip",directive),Vue.directive("close-popover",vclosepopover),Vue.component("v-popover",Popover)}}__webpack_require__.d(__webpack_exports__,"a",function(){return VTooltip});for(var _typeof2="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},isBrowser="undefined"!=typeof window&&"undefined"!=typeof document,longerTimeoutBrowsers=["Edge","Trident","Firefox"],timeoutDuration=0,i=0;i<longerTimeoutBrowsers.length;i+=1)if(isBrowser&&navigator.userAgent.indexOf(longerTimeoutBrowsers[i])>=0){timeoutDuration=1;break}var supportsMicroTasks=isBrowser&&window.Promise,debounce=supportsMicroTasks?microtaskDebounce:taskDebounce,isIE11=isBrowser&&!(!window.MSInputMethodContext||!document.documentMode),isIE10=isBrowser&&/MSIE 10/.test(navigator.userAgent),classCallCheck=function(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")},createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),defineProperty=function(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj},_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},placements=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],validPlacements=placements.slice(3),BEHAVIORS={FLIP:"flip",CLOCKWISE:"clockwise",COUNTERCLOCKWISE:"counterclockwise"},modifiers={shift:{order:100,enabled:!0,fn:shift},offset:{order:200,enabled:!0,fn:offset,offset:0},preventOverflow:{order:300,enabled:!0,fn:preventOverflow,priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:keepTogether},arrow:{order:500,enabled:!0,fn:arrow,element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:flip,behavior:"flip",padding:5,boundariesElement:"viewport"},inner:{order:700,enabled:!1,fn:inner},hide:{order:800,enabled:!0,fn:hide},computeStyle:{order:850,enabled:!0,fn:computeStyle,gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:applyStyle,onLoad:applyStyleOnLoad,gpuAcceleration:void 0}},Defaults={placement:"bottom",positionFixed:!1,eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:modifiers},Popper=function(){function Popper(reference,popper){var _this=this,options=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};classCallCheck(this,Popper),this.scheduleUpdate=function(){return requestAnimationFrame(_this.update)},this.update=debounce(this.update.bind(this)),this.options=_extends({},Popper.Defaults,options),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=reference&&reference.jquery?reference[0]:reference,this.popper=popper&&popper.jquery?popper[0]:popper,this.options.modifiers={},Object.keys(_extends({},Popper.Defaults.modifiers,options.modifiers)).forEach(function(name){_this.options.modifiers[name]=_extends({},Popper.Defaults.modifiers[name]||{},options.modifiers?options.modifiers[name]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(name){return _extends({name:name},_this.options.modifiers[name])}).sort(function(a,b){return a.order-b.order}),this.modifiers.forEach(function(modifierOptions){modifierOptions.enabled&&isFunction(modifierOptions.onLoad)&&modifierOptions.onLoad(_this.reference,_this.popper,_this.options,modifierOptions,_this.state)}),this.update();var eventsEnabled=this.options.eventsEnabled;eventsEnabled&&this.enableEventListeners(),this.state.eventsEnabled=eventsEnabled}return createClass(Popper,[{key:"update",value:function(){return update.call(this)}},{key:"destroy",value:function(){return destroy.call(this)}},{key:"enableEventListeners",value:function(){return enableEventListeners.call(this)}},{key:"disableEventListeners",value:function(){return disableEventListeners.call(this)}}]),Popper}();Popper.Utils=("undefined"!=typeof window?window:global).PopperUtils,Popper.placements=placements,Popper.Defaults=Defaults;var SVGAnimatedString=function(){};"undefined"!=typeof window&&(SVGAnimatedString=window.SVGAnimatedString);var supportsPassive=!1;if("undefined"!=typeof window){supportsPassive=!1;try{var opts=Object.defineProperty({},"passive",{get:function(){supportsPassive=!0}});window.addEventListener("test",null,opts)}catch(e){}}var _typeof="function"==typeof Symbol&&"symbol"===_typeof2(Symbol.iterator)?function(obj){return void 0===obj?"undefined":_typeof2(obj)}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":void 0===obj?"undefined":_typeof2(obj)},classCallCheck$1=function(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")},createClass$1=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_extends$1=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},DEFAULT_OPTIONS={container:!1,delay:0,html:!1,placement:"top",title:"",template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",offset:0},openTooltips=[],Tooltip=function(){function Tooltip(reference,options){classCallCheck$1(this,Tooltip),_initialiseProps.call(this),options=_extends$1({},DEFAULT_OPTIONS,options),reference.jquery&&(reference=reference[0]),this.reference=reference,this.options=options,this._isOpen=!1,this._init()}return createClass$1(Tooltip,[{key:"setClasses",value:function(classes){this._classes=classes}},{key:"setContent",value:function(content){this.options.title=content,this._tooltipNode&&this._setContent(content,this.options)}},{key:"setOptions",value:function(options){var classesUpdated=!1,classes=options&&options.classes||directive.options.defaultClass;this._classes!==classes&&(this.setClasses(classes),classesUpdated=!0),options=getOptions(options);var needPopperUpdate=!1,needRestart=!1;this.options.offset===options.offset&&this.options.placement===options.placement||(needPopperUpdate=!0),(this.options.template!==options.template||this.options.trigger!==options.trigger||this.options.container!==options.container||classesUpdated)&&(needRestart=!0);for(var key in options)this.options[key]=options[key];if(this._tooltipNode)if(needRestart){var isOpen=this._isOpen;this.dispose(),this._init(),isOpen&&this.show()}else needPopperUpdate&&this.popperInstance.update()}},{key:"_init",value:function(){var events="string"==typeof this.options.trigger?this.options.trigger.split(" ").filter(function(trigger){return-1!==["click","hover","focus"].indexOf(trigger)}):[];this._isDisposed=!1,this._enableDocumentTouch=-1===events.indexOf("manual"),this._setEventListeners(this.reference,events,this.options)}},{key:"_create",value:function(reference,template){var tooltipGenerator=window.document.createElement("div");tooltipGenerator.innerHTML=template.trim();var tooltipNode=tooltipGenerator.childNodes[0];return tooltipNode.id="tooltip_"+Math.random().toString(36).substr(2,10),tooltipNode.setAttribute("aria-hidden","true"),this.options.autoHide&&-1!==this.options.trigger.indexOf("hover")&&(tooltipNode.addEventListener("mouseenter",this.hide),tooltipNode.addEventListener("click",this.hide)),tooltipNode}},{key:"_setContent",value:function(content,options){var _this=this;this.asyncContent=!1,this._applyContent(content,options).then(function(){_this.popperInstance.update()})}},{key:"_applyContent",value:function(title,options){var _this2=this;return new Promise(function(resolve,reject){var allowHtml=options.html,rootNode=_this2._tooltipNode,titleNode=rootNode.querySelector(_this2.options.innerSelector);if(1===title.nodeType){if(allowHtml){for(;titleNode.firstChild;)titleNode.removeChild(titleNode.firstChild);titleNode.appendChild(title)}}else{if("function"==typeof title){var result=title();return void(result&&"function"==typeof result.then?(_this2.asyncContent=!0,options.loadingClass&&addClasses(rootNode,options.loadingClass),options.loadingContent&&_this2._applyContent(options.loadingContent,options),result.then(function(asyncResult){return options.loadingClass&&removeClasses(rootNode,options.loadingClass),_this2._applyContent(asyncResult,options)}).then(resolve).catch(reject)):_this2._applyContent(result,options).then(resolve).catch(reject))}allowHtml?titleNode.innerHTML=title:titleNode.innerText=title}resolve()})}},{key:"_show",value:function(reference,options){if(options&&"string"==typeof options.container){if(!document.querySelector(options.container))return}clearTimeout(this._disposeTimer),options=Object.assign({},options),delete options.offset;var updateClasses=!0;this._tooltipNode&&(addClasses(this._tooltipNode,this._classes),updateClasses=!1);var result=this._ensureShown(reference,options);return updateClasses&&this._tooltipNode&&addClasses(this._tooltipNode,this._classes),addClasses(reference,["v-tooltip-open"]),result}},{key:"_ensureShown",value:function(reference,options){var _this3=this;if(this._isOpen)return this;if(this._isOpen=!0,openTooltips.push(this),this._tooltipNode)return this._tooltipNode.style.display="",this._tooltipNode.setAttribute("aria-hidden","false"),this.popperInstance.enableEventListeners(),this.popperInstance.update(),this.asyncContent&&this._setContent(options.title,options),this;var title=reference.getAttribute("title")||options.title;if(!title)return this;var tooltipNode=this._create(reference,options.template);this._tooltipNode=tooltipNode,this._setContent(title,options),reference.setAttribute("aria-describedby",tooltipNode.id);var container=this._findContainer(options.container,reference);this._append(tooltipNode,container);var popperOptions=_extends$1({},options.popperOptions,{placement:options.placement});return popperOptions.modifiers=_extends$1({},popperOptions.modifiers,{arrow:{element:this.options.arrowSelector}}),options.boundariesElement&&(popperOptions.modifiers.preventOverflow={boundariesElement:options.boundariesElement}),this.popperInstance=new Popper(reference,tooltipNode,popperOptions),requestAnimationFrame(function(){!_this3._isDisposed&&_this3.popperInstance?(_this3.popperInstance.update(),requestAnimationFrame(function(){_this3._isDisposed?_this3.dispose():_this3._isOpen&&tooltipNode.setAttribute("aria-hidden","false")})):_this3.dispose()}),this}},{key:"_noLongerOpen",value:function(){var index=openTooltips.indexOf(this);-1!==index&&openTooltips.splice(index,1)}},{key:"_hide",value:function(){var _this4=this;if(!this._isOpen)return this;this._isOpen=!1,this._noLongerOpen(),this._tooltipNode.style.display="none",this._tooltipNode.setAttribute("aria-hidden","true"),this.popperInstance.disableEventListeners(),clearTimeout(this._disposeTimer);var disposeTime=directive.options.disposeTimeout;return null!==disposeTime&&(this._disposeTimer=setTimeout(function(){_this4._tooltipNode&&(_this4._tooltipNode.removeEventListener("mouseenter",_this4.hide),_this4._tooltipNode.removeEventListener("click",_this4.hide),_this4._tooltipNode.parentNode.removeChild(_this4._tooltipNode),_this4._tooltipNode=null)},disposeTime)),removeClasses(this.reference,["v-tooltip-open"]),this}},{key:"_dispose",value:function(){var _this5=this;return this._isDisposed=!0,this._events.forEach(function(_ref){var func=_ref.func,event=_ref.event;_this5.reference.removeEventListener(event,func)}),this._events=[],this._tooltipNode?(this._hide(),this._tooltipNode.removeEventListener("mouseenter",this.hide),this._tooltipNode.removeEventListener("click",this.hide),this.popperInstance.destroy(),this.popperInstance.options.removeOnDestroy||(this._tooltipNode.parentNode.removeChild(this._tooltipNode),this._tooltipNode=null)):this._noLongerOpen(),this}},{key:"_findContainer",value:function(container,reference){return"string"==typeof container?container=window.document.querySelector(container):!1===container&&(container=reference.parentNode),container}},{key:"_append",value:function(tooltipNode,container){container.appendChild(tooltipNode)}},{key:"_setEventListeners",value:function(reference,events,options){var _this6=this,directEvents=[],oppositeEvents=[];events.forEach(function(event){switch(event){case"hover":directEvents.push("mouseenter"),oppositeEvents.push("mouseleave"),_this6.options.hideOnTargetClick&&oppositeEvents.push("click");break;case"focus":directEvents.push("focus"),oppositeEvents.push("blur"),_this6.options.hideOnTargetClick&&oppositeEvents.push("click");break;case"click":directEvents.push("click"),oppositeEvents.push("click")}}),directEvents.forEach(function(event){var func=function(evt){!0!==_this6._isOpen&&(evt.usedByTooltip=!0,_this6._scheduleShow(reference,options.delay,options,evt))};_this6._events.push({event:event,func:func}),reference.addEventListener(event,func)}),oppositeEvents.forEach(function(event){var func=function(evt){!0!==evt.usedByTooltip&&_this6._scheduleHide(reference,options.delay,options,evt)};_this6._events.push({event:event,func:func}),reference.addEventListener(event,func)})}},{key:"_onDocumentTouch",value:function(event){this._enableDocumentTouch&&this._scheduleHide(this.reference,this.options.delay,this.options,event)}},{key:"_scheduleShow",value:function(reference,delay,options){var _this7=this,computedDelay=delay&&delay.show||delay||0;clearTimeout(this._scheduleTimer),this._scheduleTimer=window.setTimeout(function(){return _this7._show(reference,options)},computedDelay)}},{key:"_scheduleHide",value:function(reference,delay,options,evt){var _this8=this,computedDelay=delay&&delay.hide||delay||0;clearTimeout(this._scheduleTimer),this._scheduleTimer=window.setTimeout(function(){if(!1!==_this8._isOpen&&document.body.contains(_this8._tooltipNode)){if("mouseleave"===evt.type){if(_this8._setTooltipNodeEvent(evt,reference,delay,options))return}_this8._hide(reference,options)}},computedDelay)}}]),Tooltip}(),_initialiseProps=function(){var _this9=this;this.show=function(){_this9._show(_this9.reference,_this9.options)},this.hide=function(){_this9._hide()},this.dispose=function(){_this9._dispose()},this.toggle=function(){return _this9._isOpen?_this9.hide():_this9.show()},this._events=[],this._setTooltipNodeEvent=function(evt,reference,delay,options){var relatedreference=evt.relatedreference||evt.toElement||evt.relatedTarget,callback=function callback(evt2){var relatedreference2=evt2.relatedreference||evt2.toElement||evt2.relatedTarget;_this9._tooltipNode.removeEventListener(evt.type,callback),reference.contains(relatedreference2)||_this9._scheduleHide(reference,options.delay,options,evt2)};return!!_this9._tooltipNode.contains(relatedreference)&&(_this9._tooltipNode.addEventListener(evt.type,callback),!0)}};"undefined"!=typeof document&&document.addEventListener("touchstart",function(event){for(var i=0;i<openTooltips.length;i++)openTooltips[i]._onDocumentTouch(event)},!supportsPassive||{passive:!0,capture:!0});var state={enabled:!0},positions=["top","top-start","top-end","right","right-start","right-end","bottom","bottom-start","bottom-end","left","left-start","left-end"],defaultOptions={defaultPlacement:"top",defaultClass:"vue-tooltip-theme",defaultTargetClass:"has-tooltip",defaultHtml:!0,defaultTemplate:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',defaultArrowSelector:".tooltip-arrow, .tooltip__arrow",defaultInnerSelector:".tooltip-inner, .tooltip__inner",defaultDelay:0,defaultTrigger:"hover focus",defaultOffset:0,defaultContainer:"body",defaultBoundariesElement:void 0,defaultPopperOptions:{},defaultLoadingClass:"tooltip-loading",defaultLoadingContent:"...",autoHide:!0,defaultHideOnTargetClick:!0,disposeTimeout:5e3,popover:{defaultPlacement:"bottom",defaultClass:"vue-popover-theme",defaultBaseClass:"tooltip popover",defaultWrapperClass:"wrapper",defaultInnerClass:"tooltip-inner popover-inner",defaultArrowClass:"tooltip-arrow popover-arrow",defaultDelay:0,defaultTrigger:"click",defaultOffset:0,defaultContainer:"body",defaultBoundariesElement:void 0,defaultPopperOptions:{},defaultAutoHide:!0,defaultHandleResize:!0}},directive={options:defaultOptions,bind:bind,update:bind,unbind:function(el){destroyTooltip(el)}},vclosepopover={bind:function(el,_ref){var value=_ref.value,modifiers=_ref.modifiers;el.$_closePopoverModifiers=modifiers,(void 0===value||value)&&addListeners(el)},update:function(el,_ref2){var value=_ref2.value,oldValue=_ref2.oldValue,modifiers=_ref2.modifiers;el.$_closePopoverModifiers=modifiers,value!==oldValue&&(void 0===value||value?addListeners(el):removeListeners(el))},unbind:function(el){removeListeners(el)}},isIE$1=void 0,ResizeObserver={render:function(){var _vm=this,_h=_vm.$createElement;return(_vm._self._c||_h)("div",{staticClass:"resize-observer",attrs:{tabindex:"-1"}})},staticRenderFns:[],_scopeId:"data-v-b329ee4c",name:"resize-observer",methods:{notify:function(){this.$emit("notify")},addResizeHandlers:function(){this._resizeObject.contentDocument.defaultView.addEventListener("resize",this.notify),this._w===this.$el.offsetWidth&&this._h===this.$el.offsetHeight||this.notify()},removeResizeHandlers:function(){this._resizeObject&&this._resizeObject.onload&&(!isIE$1&&this._resizeObject.contentDocument&&this._resizeObject.contentDocument.defaultView.removeEventListener("resize",this.notify),delete this._resizeObject.onload)}},mounted:function(){var _this=this;initCompat(),this.$nextTick(function(){_this._w=_this.$el.offsetWidth,_this._h=_this.$el.offsetHeight});var object=document.createElement("object");this._resizeObject=object,object.setAttribute("style","display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;"),object.setAttribute("aria-hidden","true"),object.setAttribute("tabindex",-1),object.onload=this.addResizeHandlers,object.type="text/html",isIE$1&&this.$el.appendChild(object),object.data="about:blank",isIE$1||this.$el.appendChild(object)},beforeDestroy:function(){this.removeResizeHandlers()}},plugin$2={version:"0.4.4",install:install$1},GlobalVue$1=null;"undefined"!=typeof window?GlobalVue$1=window.Vue:void 0!==global&&(GlobalVue$1=global.Vue),GlobalVue$1&&GlobalVue$1.use(plugin$2);var isIOS=!1;"undefined"!=typeof window&&"undefined"!=typeof navigator&&(isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream);var openPopovers=[],Element=function(){};"undefined"!=typeof window&&(Element=window.Element);var Popover={render:function(){var _vm=this,_h=_vm.$createElement,_c=_vm._self._c||_h;return _c("div",{staticClass:"v-popover",class:_vm.cssClass},[_c("span",{ref:"trigger",staticClass:"trigger",staticStyle:{display:"inline-block"},attrs:{"aria-describedby":_vm.popoverId,tabindex:-1!==_vm.trigger.indexOf("focus")?0:-1}},[_vm._t("default")],2),_vm._v(" "),_c("div",{ref:"popover",class:[_vm.popoverBaseClass,_vm.popoverClass,_vm.cssClass],style:{visibility:_vm.isOpen?"visible":"hidden"},attrs:{id:_vm.popoverId,"aria-hidden":_vm.isOpen?"false":"true"}},[_c("div",{class:_vm.popoverWrapperClass},[_c("div",{ref:"inner",class:_vm.popoverInnerClass,staticStyle:{position:"relative"}},[_c("div",[_vm._t("popover")],2),_vm._v(" "),_vm.handleResize?_c("ResizeObserver",{on:{notify:_vm.$_handleResize}}):_vm._e()],1),_vm._v(" "),_c("div",{ref:"arrow",class:_vm.popoverArrowClass})])])])},staticRenderFns:[],name:"VPopover",components:{ResizeObserver:ResizeObserver},props:{open:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},placement:{type:String,default:function(){return getDefault("defaultPlacement")}},delay:{type:[String,Number,Object],default:function(){return getDefault("defaultDelay")}},offset:{type:[String,Number],default:function(){return getDefault("defaultOffset")}},trigger:{type:String,default:function(){return getDefault("defaultTrigger")}},container:{type:[String,Object,Element],default:function(){return getDefault("defaultContainer")}},boundariesElement:{type:Element,default:function(){return getDefault("defaultBoundariesElement")}},popperOptions:{type:Object,default:function(){return getDefault("defaultPopperOptions")}},popoverClass:{type:[String,Array],default:function(){return getDefault("defaultClass")}},popoverBaseClass:{type:[String,Array],default:function(){return directive.options.popover.defaultBaseClass}},popoverInnerClass:{type:[String,Array],default:function(){return directive.options.popover.defaultInnerClass}},popoverWrapperClass:{type:[String,Array],default:function(){return directive.options.popover.defaultWrapperClass}},popoverArrowClass:{type:[String,Array],default:function(){return directive.options.popover.defaultArrowClass}},autoHide:{type:Boolean,default:function(){return directive.options.popover.defaultAutoHide}},handleResize:{type:Boolean,default:function(){return directive.options.popover.defaultHandleResize}},openGroup:{type:String,default:null}},data:function(){return{isOpen:!1,id:Math.random().toString(36).substr(2,10)}},computed:{cssClass:function(){return{open:this.isOpen}},popoverId:function(){return"popover_"+this.id}},watch:{open:function(val){val?this.show():this.hide()},disabled:function(val,oldVal){val!==oldVal&&(val?this.hide():this.open&&this.show())},container:function(val){if(this.isOpen&&this.popperInstance){var popoverNode=this.$refs.popover,reference=this.$refs.trigger,container=this.$_findContainer(this.container,reference);if(!container)return void console.warn("No container for popover",this);container.appendChild(popoverNode),this.popperInstance.scheduleUpdate()}},trigger:function(val){this.$_removeEventListeners(),this.$_addEventListeners()},placement:function(val){var _this=this;this.$_updatePopper(function(){_this.popperInstance.options.placement=val})},offset:"$_restartPopper",boundariesElement:"$_restartPopper",popperOptions:{handler:"$_restartPopper",deep:!0}},created:function(){this.$_isDisposed=!1,this.$_mounted=!1,this.$_events=[],this.$_preventOpen=!1},mounted:function(){var popoverNode=this.$refs.popover;popoverNode.parentNode&&popoverNode.parentNode.removeChild(popoverNode),this.$_init(),this.open&&this.show()},beforeDestroy:function(){this.dispose()},methods:{show:function(){var _this2=this,_ref=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},event=_ref.event,_ref$force=(_ref.skipDelay,_ref.force);!(void 0!==_ref$force&&_ref$force)&&this.disabled||(this.$_scheduleShow(event),this.$emit("show")),this.$emit("update:open",!0),this.$_beingShowed=!0,requestAnimationFrame(function(){_this2.$_beingShowed=!1})},hide:function(){var _ref2=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},event=_ref2.event;_ref2.skipDelay;this.$_scheduleHide(event),this.$emit("hide"),this.$emit("update:open",!1)},dispose:function(){if(this.$_isDisposed=!0,this.$_removeEventListeners(),this.hide({skipDelay:!0}),this.popperInstance&&(this.popperInstance.destroy(),!this.popperInstance.options.removeOnDestroy)){var popoverNode=this.$refs.popover;popoverNode.parentNode&&popoverNode.parentNode.removeChild(popoverNode)}this.$_mounted=!1,this.popperInstance=null,this.isOpen=!1,this.$emit("dispose")},$_init:function(){-1===this.trigger.indexOf("manual")&&this.$_addEventListeners()},$_show:function(){var _this3=this,reference=this.$refs.trigger,popoverNode=this.$refs.popover;if(clearTimeout(this.$_disposeTimer),!this.isOpen){if(this.popperInstance&&(this.isOpen=!0,this.popperInstance.enableEventListeners(),this.popperInstance.scheduleUpdate()),!this.$_mounted){var container=this.$_findContainer(this.container,reference);if(!container)return void console.warn("No container for popover",this);container.appendChild(popoverNode),this.$_mounted=!0}if(!this.popperInstance){var popperOptions=_extends$1({},this.popperOptions,{placement:this.placement});if(popperOptions.modifiers=_extends$1({},popperOptions.modifiers,{arrow:{element:this.$refs.arrow}}),this.offset){var offset=this.$_getOffset();popperOptions.modifiers.offset={offset:offset}}this.boundariesElement&&(popperOptions.modifiers.preventOverflow={boundariesElement:this.boundariesElement}),this.popperInstance=new Popper(reference,popoverNode,popperOptions),requestAnimationFrame(function(){!_this3.$_isDisposed&&_this3.popperInstance?(_this3.popperInstance.scheduleUpdate(),requestAnimationFrame(function(){_this3.$_isDisposed?_this3.dispose():_this3.isOpen=!0})):_this3.dispose()})}var openGroup=this.openGroup;if(openGroup)for(var popover=void 0,i=0;i<openPopovers.length;i++)popover=openPopovers[i],popover.openGroup!==openGroup&&(popover.hide(),popover.$emit("close-group"));openPopovers.push(this),this.$emit("apply-show")}},$_hide:function(){var _this4=this;if(this.isOpen){var index=openPopovers.indexOf(this);-1!==index&&openPopovers.splice(index,1),this.isOpen=!1,this.popperInstance&&this.popperInstance.disableEventListeners(),clearTimeout(this.$_disposeTimer);var disposeTime=directive.options.popover.disposeTimeout||directive.options.disposeTimeout;null!==disposeTime&&(this.$_disposeTimer=setTimeout(function(){var popoverNode=_this4.$refs.popover;popoverNode&&(popoverNode.parentNode&&popoverNode.parentNode.removeChild(popoverNode),_this4.$_mounted=!1)},disposeTime)),this.$emit("apply-hide")}},$_findContainer:function(container,reference){return"string"==typeof container?container=window.document.querySelector(container):!1===container&&(container=reference.parentNode),container},$_getOffset:function(){var typeofOffset=_typeof(this.offset),offset=this.offset;return("number"===typeofOffset||"string"===typeofOffset&&-1===offset.indexOf(","))&&(offset="0, "+offset),offset},$_addEventListeners:function(){var _this5=this,reference=this.$refs.trigger,directEvents=[],oppositeEvents=[];("string"==typeof this.trigger?this.trigger.split(" ").filter(function(trigger){return-1!==["click","hover","focus"].indexOf(trigger)}):[]).forEach(function(event){switch(event){case"hover":directEvents.push("mouseenter"),oppositeEvents.push("mouseleave");break;case"focus":directEvents.push("focus"),oppositeEvents.push("blur");break;case"click":directEvents.push("click"),oppositeEvents.push("click")}}),directEvents.forEach(function(event){var func=function(event){_this5.isOpen||(event.usedByTooltip=!0,!_this5.$_preventOpen&&_this5.show({event:event}))};_this5.$_events.push({event:event,func:func}),reference.addEventListener(event,func)}),oppositeEvents.forEach(function(event){var func=function(event){event.usedByTooltip||_this5.hide({event:event})};_this5.$_events.push({event:event,func:func}),reference.addEventListener(event,func)})},$_scheduleShow:function(){var skipDelay=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(clearTimeout(this.$_scheduleTimer),skipDelay)this.$_show();else{var computedDelay=parseInt(this.delay&&this.delay.show||this.delay||0);this.$_scheduleTimer=setTimeout(this.$_show.bind(this),computedDelay)}},$_scheduleHide:function(){var _this6=this,event=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,skipDelay=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(clearTimeout(this.$_scheduleTimer),skipDelay)this.$_hide();else{var computedDelay=parseInt(this.delay&&this.delay.hide||this.delay||0);this.$_scheduleTimer=setTimeout(function(){if(_this6.isOpen){if(event&&"mouseleave"===event.type){if(_this6.$_setTooltipNodeEvent(event))return}_this6.$_hide()}},computedDelay)}},$_setTooltipNodeEvent:function(event){var _this7=this,reference=this.$refs.trigger,popoverNode=this.$refs.popover,relatedreference=event.relatedreference||event.toElement||event.relatedTarget,callback=function callback(event2){var relatedreference2=event2.relatedreference||event2.toElement||event2.relatedTarget;popoverNode.removeEventListener(event.type,callback),reference.contains(relatedreference2)||_this7.hide({event:event2})};return!!popoverNode.contains(relatedreference)&&(popoverNode.addEventListener(event.type,callback),!0)},$_removeEventListeners:function(){var reference=this.$refs.trigger;this.$_events.forEach(function(_ref3){var func=_ref3.func,event=_ref3.event;reference.removeEventListener(event,func)}),this.$_events=[]},$_updatePopper:function(cb){this.popperInstance&&(cb(),this.isOpen&&this.popperInstance.scheduleUpdate())},$_restartPopper:function(){if(this.popperInstance){var isOpen=this.isOpen;this.dispose(),this.$_isDisposed=!1,this.$_init(),isOpen&&this.show({skipDelay:!0,force:!0})}},$_handleGlobalClose:function(event){var _this8=this,touch=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.$_beingShowed||(this.hide({event:event}),event.closePopover?this.$emit("close-directive"):this.$emit("auto-hide"),touch&&(this.$_preventOpen=!0,setTimeout(function(){_this8.$_preventOpen=!1},300)))},$_handleResize:function(){this.isOpen&&this.popperInstance&&(this.popperInstance.scheduleUpdate(),this.$emit("resize"))}}};"undefined"!=typeof document&&"undefined"!=typeof window&&(isIOS?document.addEventListener("touchend",handleGlobalTouchend,!supportsPassive||{passive:!0,capture:!0}):window.addEventListener("click",handleGlobalClick,!0));var commonjsGlobal="undefined"!=typeof window?window:void 0!==global?global:"undefined"!=typeof self?self:{},lodash_merge=function(fn,module){return module={exports:{}},fn(module,module.exports),module.exports}(function(module,exports){function apply(func,thisArg,args){switch(args.length){case 0:return func.call(thisArg);case 1:return func.call(thisArg,args[0]);case 2:return func.call(thisArg,args[0],args[1]);case 3:return func.call(thisArg,args[0],args[1],args[2])}return func.apply(thisArg,args)}function baseTimes(n,iteratee){for(var index=-1,result=Array(n);++index<n;)result[index]=iteratee(index);return result}function getValue(object,key){return null==object?void 0:object[key]}function safeGet(object,key){return"__proto__"==key?void 0:object[key]}function Hash(entries){var index=-1,length=null==entries?0:entries.length;for(this.clear();++index<length;){var entry=entries[index];this.set(entry[0],entry[1])}}function hashClear(){this.__data__=nativeCreate?nativeCreate(null):{},this.size=0}function hashDelete(key){var result=this.has(key)&&delete this.__data__[key];return this.size-=result?1:0,result}function hashGet(key){var data=this.__data__;if(nativeCreate){var result=data[key];return result===HASH_UNDEFINED?void 0:result}return hasOwnProperty.call(data,key)?data[key]:void 0}function hashHas(key){var data=this.__data__;return nativeCreate?void 0!==data[key]:hasOwnProperty.call(data,key)}function hashSet(key,value){var data=this.__data__;return this.size+=this.has(key)?0:1,data[key]=nativeCreate&&void 0===value?HASH_UNDEFINED:value,this}function ListCache(entries){var index=-1,length=null==entries?0:entries.length;for(this.clear();++index<length;){var entry=entries[index];this.set(entry[0],entry[1])}}function listCacheClear(){this.__data__=[],this.size=0}function listCacheDelete(key){var data=this.__data__,index=assocIndexOf(data,key);return!(index<0)&&(index==data.length-1?data.pop():splice.call(data,index,1),--this.size,!0)}function listCacheGet(key){var data=this.__data__,index=assocIndexOf(data,key);return index<0?void 0:data[index][1]}function listCacheHas(key){return assocIndexOf(this.__data__,key)>-1}function listCacheSet(key,value){var data=this.__data__,index=assocIndexOf(data,key);return index<0?(++this.size,data.push([key,value])):data[index][1]=value,this}function MapCache(entries){var index=-1,length=null==entries?0:entries.length;for(this.clear();++index<length;){var entry=entries[index];this.set(entry[0],entry[1])}}function mapCacheClear(){this.size=0,this.__data__={hash:new Hash,map:new(Map||ListCache),string:new Hash}}function mapCacheDelete(key){var result=getMapData(this,key).delete(key);return this.size-=result?1:0,result}function mapCacheGet(key){return getMapData(this,key).get(key)}function mapCacheHas(key){return getMapData(this,key).has(key)}function mapCacheSet(key,value){var data=getMapData(this,key),size=data.size;return data.set(key,value),this.size+=data.size==size?0:1,this}function Stack(entries){var data=this.__data__=new ListCache(entries);this.size=data.size}function stackClear(){this.__data__=new ListCache,this.size=0}function stackDelete(key){var data=this.__data__,result=data.delete(key);return this.size=data.size,result}function stackGet(key){return this.__data__.get(key)}function stackHas(key){return this.__data__.has(key)}function stackSet(key,value){var data=this.__data__;if(data instanceof ListCache){var pairs=data.__data__;if(!Map||pairs.length<LARGE_ARRAY_SIZE-1)return pairs.push([key,value]),this.size=++data.size,this;data=this.__data__=new MapCache(pairs)}return data.set(key,value),this.size=data.size,this}function arrayLikeKeys(value,inherited){var isArr=isArray(value),isArg=!isArr&&isArguments(value),isBuff=!isArr&&!isArg&&isBuffer(value),isType=!isArr&&!isArg&&!isBuff&&isTypedArray(value),skipIndexes=isArr||isArg||isBuff||isType,result=skipIndexes?baseTimes(value.length,String):[],length=result.length;for(var key in value)!inherited&&!hasOwnProperty.call(value,key)||skipIndexes&&("length"==key||isBuff&&("offset"==key||"parent"==key)||isType&&("buffer"==key||"byteLength"==key||"byteOffset"==key)||isIndex(key,length))||result.push(key);return result}function assignMergeValue(object,key,value){(void 0===value||eq(object[key],value))&&(void 0!==value||key in object)||baseAssignValue(object,key,value)}function assignValue(object,key,value){var objValue=object[key];hasOwnProperty.call(object,key)&&eq(objValue,value)&&(void 0!==value||key in object)||baseAssignValue(object,key,value)}function assocIndexOf(array,key){for(var length=array.length;length--;)if(eq(array[length][0],key))return length;return-1}function baseAssignValue(object,key,value){"__proto__"==key&&defineProperty?defineProperty(object,key,{configurable:!0,enumerable:!0,value:value,writable:!0}):object[key]=value}function baseGetTag(value){return null==value?void 0===value?undefinedTag:nullTag:symToStringTag&&symToStringTag in Object(value)?getRawTag(value):objectToString(value)}function baseIsArguments(value){return isObjectLike(value)&&baseGetTag(value)==argsTag}function baseIsNative(value){return!(!isObject(value)||isMasked(value))&&(isFunction(value)?reIsNative:reIsHostCtor).test(toSource(value))}function baseIsTypedArray(value){return isObjectLike(value)&&isLength(value.length)&&!!typedArrayTags[baseGetTag(value)]}function baseKeysIn(object){if(!isObject(object))return nativeKeysIn(object);var isProto=isPrototype(object),result=[];for(var key in object)("constructor"!=key||!isProto&&hasOwnProperty.call(object,key))&&result.push(key);return result}function baseMerge(object,source,srcIndex,customizer,stack){object!==source&&baseFor(source,function(srcValue,key){if(isObject(srcValue))stack||(stack=new Stack),baseMergeDeep(object,source,key,srcIndex,baseMerge,customizer,stack);else{var newValue=customizer?customizer(safeGet(object,key),srcValue,key+"",object,source,stack):void 0;void 0===newValue&&(newValue=srcValue),assignMergeValue(object,key,newValue)}},keysIn)}function baseMergeDeep(object,source,key,srcIndex,mergeFunc,customizer,stack){var objValue=safeGet(object,key),srcValue=safeGet(source,key),stacked=stack.get(srcValue);if(stacked)return void assignMergeValue(object,key,stacked);var newValue=customizer?customizer(objValue,srcValue,key+"",object,source,stack):void 0,isCommon=void 0===newValue;if(isCommon){var isArr=isArray(srcValue),isBuff=!isArr&&isBuffer(srcValue),isTyped=!isArr&&!isBuff&&isTypedArray(srcValue);newValue=srcValue,isArr||isBuff||isTyped?isArray(objValue)?newValue=objValue:isArrayLikeObject(objValue)?newValue=copyArray(objValue):isBuff?(isCommon=!1,newValue=cloneBuffer(srcValue,!0)):isTyped?(isCommon=!1,newValue=cloneTypedArray(srcValue,!0)):newValue=[]:isPlainObject(srcValue)||isArguments(srcValue)?(newValue=objValue,isArguments(objValue)?newValue=toPlainObject(objValue):(!isObject(objValue)||srcIndex&&isFunction(objValue))&&(newValue=initCloneObject(srcValue))):isCommon=!1}isCommon&&(stack.set(srcValue,newValue),mergeFunc(newValue,srcValue,srcIndex,customizer,stack),stack.delete(srcValue)),assignMergeValue(object,key,newValue)}function baseRest(func,start){return setToString(overRest(func,start,identity),func+"")}function cloneBuffer(buffer,isDeep){if(isDeep)return buffer.slice();var length=buffer.length,result=allocUnsafe?allocUnsafe(length):new buffer.constructor(length);return buffer.copy(result),result}function cloneArrayBuffer(arrayBuffer){var result=new arrayBuffer.constructor(arrayBuffer.byteLength);return new Uint8Array(result).set(new Uint8Array(arrayBuffer)),result}function cloneTypedArray(typedArray,isDeep){var buffer=isDeep?cloneArrayBuffer(typedArray.buffer):typedArray.buffer;return new typedArray.constructor(buffer,typedArray.byteOffset,typedArray.length)}function copyArray(source,array){var index=-1,length=source.length;for(array||(array=Array(length));++index<length;)array[index]=source[index];return array}function copyObject(source,props,object,customizer){var isNew=!object;object||(object={});for(var index=-1,length=props.length;++index<length;){var key=props[index],newValue=customizer?customizer(object[key],source[key],key,object,source):void 0;void 0===newValue&&(newValue=source[key]),isNew?baseAssignValue(object,key,newValue):assignValue(object,key,newValue)}return object}function getMapData(map,key){var data=map.__data__;return isKeyable(key)?data["string"==typeof key?"string":"hash"]:data.map}function getNative(object,key){var value=getValue(object,key);return baseIsNative(value)?value:void 0}function getRawTag(value){var isOwn=hasOwnProperty.call(value,symToStringTag),tag=value[symToStringTag];try{value[symToStringTag]=void 0;var unmasked=!0}catch(e){}var result=nativeObjectToString.call(value);return unmasked&&(isOwn?value[symToStringTag]=tag:delete value[symToStringTag]),result}function initCloneObject(object){return"function"!=typeof object.constructor||isPrototype(object)?{}:baseCreate(getPrototype(object))}function isIndex(value,length){var type=void 0===value?"undefined":_typeof2(value);return!!(length=null==length?MAX_SAFE_INTEGER:length)&&("number"==type||"symbol"!=type&&reIsUint.test(value))&&value>-1&&value%1==0&&value<length}function isIterateeCall(value,index,object){if(!isObject(object))return!1;var type=void 0===index?"undefined":_typeof2(index);return!!("number"==type?isArrayLike(object)&&isIndex(index,object.length):"string"==type&&index in object)&&eq(object[index],value)}function isKeyable(value){var type=void 0===value?"undefined":_typeof2(value);return"string"==type||"number"==type||"symbol"==type||"boolean"==type?"__proto__"!==value:null===value}function isMasked(func){return!!maskSrcKey&&maskSrcKey in func}function isPrototype(value){var Ctor=value&&value.constructor;return value===("function"==typeof Ctor&&Ctor.prototype||objectProto)}function nativeKeysIn(object){var result=[];if(null!=object)for(var key in Object(object))result.push(key);return result}function objectToString(value){return nativeObjectToString.call(value)}function overRest(func,start,transform){return start=nativeMax(void 0===start?func.length-1:start,0),function(){for(var args=arguments,index=-1,length=nativeMax(args.length-start,0),array=Array(length);++index<length;)array[index]=args[start+index];index=-1;for(var otherArgs=Array(start+1);++index<start;)otherArgs[index]=args[index];return otherArgs[start]=transform(array),apply(func,this,otherArgs)}}function toSource(func){if(null!=func){try{return funcToString.call(func)}catch(e){}try{return func+""}catch(e){}}return""}function eq(value,other){return value===other||value!==value&&other!==other}function isArrayLike(value){return null!=value&&isLength(value.length)&&!isFunction(value)}function isArrayLikeObject(value){return isObjectLike(value)&&isArrayLike(value)}function isFunction(value){if(!isObject(value))return!1;var tag=baseGetTag(value);return tag==funcTag||tag==genTag||tag==asyncTag||tag==proxyTag}function isLength(value){return"number"==typeof value&&value>-1&&value%1==0&&value<=MAX_SAFE_INTEGER}function isObject(value){var type=void 0===value?"undefined":_typeof2(value);return null!=value&&("object"==type||"function"==type)}function isObjectLike(value){return null!=value&&"object"==(void 0===value?"undefined":_typeof2(value))}function isPlainObject(value){if(!isObjectLike(value)||baseGetTag(value)!=objectTag)return!1;var proto=getPrototype(value);if(null===proto)return!0;var Ctor=hasOwnProperty.call(proto,"constructor")&&proto.constructor;return"function"==typeof Ctor&&Ctor instanceof Ctor&&funcToString.call(Ctor)==objectCtorString}function toPlainObject(value){return copyObject(value,keysIn(value))}function keysIn(object){return isArrayLike(object)?arrayLikeKeys(object,!0):baseKeysIn(object)}function constant(value){return function(){return value}}function identity(value){return value}function stubFalse(){return!1}var LARGE_ARRAY_SIZE=200,HASH_UNDEFINED="__lodash_hash_undefined__",HOT_COUNT=800,HOT_SPAN=16,MAX_SAFE_INTEGER=9007199254740991,argsTag="[object Arguments]",asyncTag="[object AsyncFunction]",funcTag="[object Function]",genTag="[object GeneratorFunction]",nullTag="[object Null]",objectTag="[object Object]",proxyTag="[object Proxy]",undefinedTag="[object Undefined]",reRegExpChar=/[\\^$.*+?()[\]{}|]/g,reIsHostCtor=/^\[object .+?Constructor\]$/,reIsUint=/^(?:0|[1-9]\d*)$/,typedArrayTags={};typedArrayTags["[object Float32Array]"]=typedArrayTags["[object Float64Array]"]=typedArrayTags["[object Int8Array]"]=typedArrayTags["[object Int16Array]"]=typedArrayTags["[object Int32Array]"]=typedArrayTags["[object Uint8Array]"]=typedArrayTags["[object Uint8ClampedArray]"]=typedArrayTags["[object Uint16Array]"]=typedArrayTags["[object Uint32Array]"]=!0,typedArrayTags[argsTag]=typedArrayTags["[object Array]"]=typedArrayTags["[object ArrayBuffer]"]=typedArrayTags["[object Boolean]"]=typedArrayTags["[object DataView]"]=typedArrayTags["[object Date]"]=typedArrayTags["[object Error]"]=typedArrayTags[funcTag]=typedArrayTags["[object Map]"]=typedArrayTags["[object Number]"]=typedArrayTags[objectTag]=typedArrayTags["[object RegExp]"]=typedArrayTags["[object Set]"]=typedArrayTags["[object String]"]=typedArrayTags["[object WeakMap]"]=!1;var freeGlobal="object"==(void 0===commonjsGlobal?"undefined":_typeof2(commonjsGlobal))&&commonjsGlobal&&commonjsGlobal.Object===Object&&commonjsGlobal,freeSelf="object"==("undefined"==typeof self?"undefined":_typeof2(self))&&self&&self.Object===Object&&self,root=freeGlobal||freeSelf||Function("return this")(),freeExports=exports&&!exports.nodeType&&exports,freeModule=freeExports&&!0&&module&&!module.nodeType&&module,moduleExports=freeModule&&freeModule.exports===freeExports,freeProcess=moduleExports&&freeGlobal.process,nodeUtil=function(){try{return freeProcess&&freeProcess.binding&&freeProcess.binding("util")}catch(e){}}(),nodeIsTypedArray=nodeUtil&&nodeUtil.isTypedArray,arrayProto=Array.prototype,funcProto=Function.prototype,objectProto=Object.prototype,coreJsData=root["__core-js_shared__"],funcToString=funcProto.toString,hasOwnProperty=objectProto.hasOwnProperty,maskSrcKey=function(){var uid=/[^.]+$/.exec(coreJsData&&coreJsData.keys&&coreJsData.keys.IE_PROTO||"");return uid?"Symbol(src)_1."+uid:""}(),nativeObjectToString=objectProto.toString,objectCtorString=funcToString.call(Object),reIsNative=RegExp("^"+funcToString.call(hasOwnProperty).replace(reRegExpChar,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Buffer=moduleExports?root.Buffer:void 0,_Symbol=root.Symbol,Uint8Array=root.Uint8Array,allocUnsafe=Buffer?Buffer.allocUnsafe:void 0,getPrototype=function(func,transform){return function(arg){return func(transform(arg))}}(Object.getPrototypeOf,Object),objectCreate=Object.create,propertyIsEnumerable=objectProto.propertyIsEnumerable,splice=arrayProto.splice,symToStringTag=_Symbol?_Symbol.toStringTag:void 0,defineProperty=function(){try{var func=getNative(Object,"defineProperty");return func({},"",{}),func}catch(e){}}(),nativeIsBuffer=Buffer?Buffer.isBuffer:void 0,nativeMax=Math.max,nativeNow=Date.now,Map=getNative(root,"Map"),nativeCreate=getNative(Object,"create"),baseCreate=function(){function object(){}return function(proto){if(!isObject(proto))return{};if(objectCreate)return objectCreate(proto);object.prototype=proto;var result=new object;return object.prototype=void 0,result}}();Hash.prototype.clear=hashClear,Hash.prototype.delete=hashDelete,Hash.prototype.get=hashGet,Hash.prototype.has=hashHas,Hash.prototype.set=hashSet,ListCache.prototype.clear=listCacheClear,ListCache.prototype.delete=listCacheDelete,ListCache.prototype.get=listCacheGet,ListCache.prototype.has=listCacheHas,ListCache.prototype.set=listCacheSet,MapCache.prototype.clear=mapCacheClear,MapCache.prototype.delete=mapCacheDelete,MapCache.prototype.get=mapCacheGet,MapCache.prototype.has=mapCacheHas,MapCache.prototype.set=mapCacheSet,Stack.prototype.clear=stackClear,Stack.prototype.delete=stackDelete,Stack.prototype.get=stackGet,Stack.prototype.has=stackHas,Stack.prototype.set=stackSet;var baseFor=function(fromRight){return function(object,iteratee,keysFunc){for(var index=-1,iterable=Object(object),props=keysFunc(object),length=props.length;length--;){var key=props[fromRight?length:++index];if(!1===iteratee(iterable[key],key,iterable))break}return object}}(),baseSetToString=defineProperty?function(func,string){return defineProperty(func,"toString",{configurable:!0,enumerable:!1,value:constant(string),writable:!0})}:identity,setToString=function(func){var count=0,lastCalled=0;return function(){var stamp=nativeNow(),remaining=HOT_SPAN-(stamp-lastCalled);if(lastCalled=stamp,remaining>0){if(++count>=HOT_COUNT)return arguments[0]}else count=0;return func.apply(void 0,arguments)}}(baseSetToString),isArguments=baseIsArguments(function(){return arguments}())?baseIsArguments:function(value){return isObjectLike(value)&&hasOwnProperty.call(value,"callee")&&!propertyIsEnumerable.call(value,"callee")},isArray=Array.isArray,isBuffer=nativeIsBuffer||stubFalse,isTypedArray=nodeIsTypedArray?function(func){return function(value){return func(value)}}(nodeIsTypedArray):baseIsTypedArray,merge=function(assigner){return baseRest(function(object,sources){var index=-1,length=sources.length,customizer=length>1?sources[length-1]:void 0,guard=length>2?sources[2]:void 0;for(customizer=assigner.length>3&&"function"==typeof customizer?(length--,customizer):void 0,guard&&isIterateeCall(sources[0],sources[1],guard)&&(customizer=length<3?void 0:customizer,length=1),object=Object(object);++index<length;){var source=sources[index];source&&assigner(object,source,index,customizer)}return object})}(function(object,source,srcIndex){baseMerge(object,source,srcIndex)});module.exports=merge}),VTooltip=directive,plugin={install:install,get enabled(){return state.enabled},set enabled(value){state.enabled=value}},GlobalVue=null;"undefined"!=typeof window?GlobalVue=window.Vue:void 0!==global&&(GlobalVue=global.Vue),GlobalVue&&GlobalVue.use(plugin)}).call(__webpack_exports__,__webpack_require__(0))},function(module,__webpack_exports__,__webpack_require__){"use strict";Object.defineProperty(__webpack_exports__,"__esModule",{value:!0});var __WEBPACK_IMPORTED_MODULE_0_v_tooltip__=__webpack_require__(5),__WEBPACK_IMPORTED_MODULE_1__Heatmap__=__webpack_require__(3),__WEBPACK_IMPORTED_MODULE_2__consts_js__=__webpack_require__(1);__WEBPACK_IMPORTED_MODULE_0_v_tooltip__.a.enabled=window.innerWidth>768,__webpack_exports__.default={directives:{tooltip:__WEBPACK_IMPORTED_MODULE_0_v_tooltip__.a},props:{endDate:{required:!0},max:{type:Number},rangeColor:{type:Array,default:function(){return __WEBPACK_IMPORTED_MODULE_2__consts_js__.a}},values:{required:!0,type:Array},locale:{type:Object},tooltip:{type:Boolean,default:!0},tooltipUnit:{type:String,default:__WEBPACK_IMPORTED_MODULE_2__consts_js__.b},vertical:{type:Boolean,default:!1}},data:function(){return{now:new Date}},computed:{position:function(){return this.vertical?"vertical":"horizontal"},tooltipTransform:function(){return"translate("+this.tooltipX+", "+this.tooltipY+")"},heatmap:function(){return new __WEBPACK_IMPORTED_MODULE_1__Heatmap__.a(this.endDate,this.values,this.max)},width:function(){return{horizontal:this.LEFT_SECTION_WIDTH+this.SQUARE_SIZE*this.heatmap.weekCount+this.SQUARE_BORDER_SIZE,vertical:this.LEFT_SECTION_WIDTH+this.SQUARE_SIZE*__WEBPACK_IMPORTED_MODULE_2__consts_js__.c+this.RIGHT_SECTION_WIDTH}},heigth:function(){return{horizontal:this.TOP_SECTION_HEIGTH+this.SQUARE_SIZE*__WEBPACK_IMPORTED_MODULE_2__consts_js__.c+this.SQUARE_BORDER_SIZE+this.BOTTOM_SECTION_HEIGTH,vertical:this.TOP_SECTION_HEIGTH+this.SQUARE_SIZE*this.heatmap.weekCount+this.SQUARE_BORDER_SIZE}},viewbox:function(){return"0 0 "+this.width[this.position]+" "+this.heigth[this.position]},daysLabelWrapperTransform:function(){return{horizontal:"translate(0, "+this.TOP_SECTION_HEIGTH+")",vertical:"translate("+this.LEFT_SECTION_WIDTH+", 0)"}},monthsLabelWrapperTransform:function(){return{horizontal:"translate("+this.LEFT_SECTION_WIDTH+", 0)",vertical:"translate(0, "+this.TOP_SECTION_HEIGTH+")"}},legendWrapperTransform:function(){return{horizontal:"translate("+(this.width[this.position]-this.SQUARE_SIZE*this.rangeColor.length-30)+", "+(this.heigth[this.position]-this.BOTTOM_SECTION_HEIGTH)+")",vertical:"translate("+(this.LEFT_SECTION_WIDTH+this.SQUARE_SIZE*__WEBPACK_IMPORTED_MODULE_2__consts_js__.c)+", "+this.TOP_SECTION_HEIGTH+")"}},yearWrapperTransform:function(){return"translate("+this.LEFT_SECTION_WIDTH+", "+this.TOP_SECTION_HEIGTH+")"},SQUARE_BORDER_SIZE:function(){return __WEBPACK_IMPORTED_MODULE_2__consts_js__.d/5},SQUARE_SIZE:function(){return __WEBPACK_IMPORTED_MODULE_2__consts_js__.d+this.SQUARE_BORDER_SIZE},TOP_SECTION_HEIGTH:function(){return __WEBPACK_IMPORTED_MODULE_2__consts_js__.d+__WEBPACK_IMPORTED_MODULE_2__consts_js__.d/2},RIGHT_SECTION_WIDTH:function(){return 3*this.SQUARE_SIZE},BOTTOM_SECTION_HEIGTH:function(){return __WEBPACK_IMPORTED_MODULE_2__consts_js__.d+__WEBPACK_IMPORTED_MODULE_2__consts_js__.d/2},LEFT_SECTION_WIDTH:function(){return Math.ceil(2.5*__WEBPACK_IMPORTED_MODULE_2__consts_js__.d)},lo:function(){return this.locale?{months:this.locale.months||__WEBPACK_IMPORTED_MODULE_2__consts_js__.e.months,days:this.locale.days||__WEBPACK_IMPORTED_MODULE_2__consts_js__.e.days,on:this.locale.on||__WEBPACK_IMPORTED_MODULE_2__consts_js__.e.on,less:this.locale.less||__WEBPACK_IMPORTED_MODULE_2__consts_js__.e.less,more:this.locale.more||__WEBPACK_IMPORTED_MODULE_2__consts_js__.e.more}:__WEBPACK_IMPORTED_MODULE_2__consts_js__.e}},methods:{tooltipOptions:function(day){return!!this.tooltip&&{content:"<b>"+day.count+" "+this.tooltipUnit+"</b> "+this.lo.on+" "+this.lo.months[day.date.getMonth()]+" "+day.date.getDate()+", "+day.date.getFullYear(),delay:{show:150,hide:50}}},getWeekPosition:function(index){return this.vertical?"translate(0, "+(this.SQUARE_SIZE*this.heatmap.weekCount-(index+1)*this.SQUARE_SIZE)+")":"translate("+index*this.SQUARE_SIZE+", 0)"},getDayPosition:function(index){return this.vertical?"translate("+index*this.SQUARE_SIZE+", 0)":"translate(0, "+index*this.SQUARE_SIZE+")"},getMonthLabelPostion:function(month){var position={x:0,y:0};return position.x=this.vertical?3:this.SQUARE_SIZE*month.index,position.y=this.vertical?this.SQUARE_SIZE*this.heatmap.weekCount-this.SQUARE_SIZE*month.index-this.SQUARE_SIZE/4:this.SQUARE_SIZE-this.SQUARE_BORDER_SIZE,position}}}},function(module,exports){},function(module,exports){},function(module,exports){module.exports=function(rawScriptExports,compiledTemplate,scopeId,cssModules){var esModule,scriptExports=rawScriptExports=rawScriptExports||{},type=typeof rawScriptExports.default;"object"!==type&&"function"!==type||(esModule=rawScriptExports,scriptExports=rawScriptExports.default);var options="function"==typeof scriptExports?scriptExports.options:scriptExports;if(compiledTemplate&&(options.render=compiledTemplate.render,options.staticRenderFns=compiledTemplate.staticRenderFns),scopeId&&(options._scopeId=scopeId),cssModules){var computed=options.computed||(options.computed={});Object.keys(cssModules).forEach(function(key){var module=cssModules[key];computed[key]=function(){return module}})}return{esModule:esModule,exports:scriptExports,options:options}}},function(module,exports){module.exports={render:function(){var _vm=this,_h=_vm.$createElement,_c=_vm._self._c||_h;return _c("svg",{staticClass:"vch__wrapper",attrs:{viewBox:_vm.viewbox}},[_c("g",{staticClass:"vch__months__labels__wrapper",attrs:{transform:_vm.monthsLabelWrapperTransform[_vm.position]}},_vm._l(_vm.heatmap.firstFullWeekOfMonths,function(month,index){return _c("text",{staticClass:"vch__month__label",attrs:{x:_vm.getMonthLabelPostion(month).x,y:_vm.getMonthLabelPostion(month).y}},[_vm._v(_vm._s(_vm.lo.months[month.value]))])})),_c("g",{staticClass:"vch__days__labels__wrapper",attrs:{transform:_vm.daysLabelWrapperTransform[_vm.position]}},[_c("text",{staticClass:"vch__day__label",attrs:{x:_vm.vertical?1*_vm.SQUARE_SIZE:0,y:_vm.vertical?_vm.SQUARE_SIZE-_vm.SQUARE_BORDER_SIZE:20}},[_vm._v(_vm._s(_vm.lo.days[1]))]),_c("text",{staticClass:"vch__day__label",attrs:{x:_vm.vertical?3*_vm.SQUARE_SIZE:0,y:_vm.vertical?_vm.SQUARE_SIZE-_vm.SQUARE_BORDER_SIZE:44}},[_vm._v(_vm._s(_vm.lo.days[3]))]),_c("text",{staticClass:"vch__day__label",attrs:{x:_vm.vertical?5*_vm.SQUARE_SIZE:0,y:_vm.vertical?_vm.SQUARE_SIZE-_vm.SQUARE_BORDER_SIZE:69}},[_vm._v(_vm._s(_vm.lo.days[5]))])]),_c("g",{staticClass:"vch__legend__wrapper",attrs:{transform:_vm.legendWrapperTransform[_vm.position]}},[_c("text",{attrs:{x:_vm.vertical?1.25*_vm.SQUARE_SIZE:-25,y:_vm.vertical?8:_vm.SQUARE_SIZE+1}},[_vm._v(_vm._s(_vm.lo.less))]),_vm._l(_vm.rangeColor,function(color,index){return _c("rect",{key:index,style:{fill:color},attrs:{width:_vm.SQUARE_SIZE-_vm.SQUARE_BORDER_SIZE,height:_vm.SQUARE_SIZE-_vm.SQUARE_BORDER_SIZE,x:_vm.vertical?1.75*_vm.SQUARE_SIZE:_vm.SQUARE_SIZE*index,y:_vm.vertical?_vm.SQUARE_SIZE*(index+1):5}})}),_c("text",{attrs:{x:_vm.vertical?1.25*_vm.SQUARE_SIZE:_vm.SQUARE_SIZE*_vm.rangeColor.length+1,y:_vm.vertical?_vm.SQUARE_SIZE*(_vm.rangeColor.length+2)-_vm.SQUARE_BORDER_SIZE:_vm.SQUARE_SIZE+1}},[_vm._v(_vm._s(_vm.lo.more))])],2),_c("g",{staticClass:"vch__year__wrapper",attrs:{transform:_vm.yearWrapperTransform}},_vm._l(_vm.heatmap.calendar,function(week,weekIndex){return _c("g",{key:weekIndex,staticClass:"vch__month__wrapper",attrs:{transform:_vm.getWeekPosition(weekIndex)}},_vm._l(week,function(day,dayIndex){return day.date<_vm.now?_c("rect",{directives:[{name:"tooltip",rawName:"v-tooltip",value:_vm.tooltipOptions(day),expression:"tooltipOptions(day)"}],key:dayIndex,staticClass:"vch__day__square",style:{fill:_vm.rangeColor[day.colorIndex]},attrs:{transform:_vm.getDayPosition(dayIndex),width:_vm.SQUARE_SIZE-_vm.SQUARE_BORDER_SIZE,height:_vm.SQUARE_SIZE-_vm.SQUARE_BORDER_SIZE},on:{click:function($event){_vm.$emit("day-click",day)}}}):_vm._e()}))}))])},staticRenderFns:[]}}])});
},{"buffer":"node_modules/buffer/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57507" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","node_modules/vue-calendar-heatmap/dist/vue-calendar-heatmap.browser.js"], null)
//# sourceMappingURL=/vue-calendar-heatmap.browser.fc97a728.map