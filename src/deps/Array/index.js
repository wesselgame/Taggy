/*
MIT License
Copyright (c) 2018 Wessel Tip
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

class ArrayUtil extends Array {
  constructor() {
    super();
    
    Array.prototype.list = this.list;
    Array.prototype.trim = this.trim;
    Array.prototype.chunk = this.chunk;
    Array.prototype.close = this.close;

  }

  list(conj = 'and') {
    if (!Array.isArray(this)) throw new TypeError('Must provide a valid array');
    const len = this.length;
    return `${this.slice(0, -1).join(', ')}${len > 1 ? ` ${conj} ` : ''}${this.slice(-1)}`;
  }

  trim(length = 1) {
    if (!Array.isArray(this)) throw new TypeError('Must provide a valid array');
    let array = this;
    if (array.length > length) {
      const prevLen = array.length - length;
      array = array.slice(0, length);
      array.push(`${prevLen} more...`);
    }
    
    return array;
  }

  chunk(length = 1) {
    if (!Array.isArray(this)) throw new TypeError('Must provide a valid array');
    let i, chunks;
    i = 0;
    chunks = [];
    
    while (i < this.length) {
      chunks.push(this.slice(i, i += length));
    }

    return chunks;
  }
};

module.exports = new ArrayUtil();