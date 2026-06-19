'use strict';

function activeHtml(source) {
  let output = '';
  let cursor = 0;

  while (cursor < source.length) {
    const commentStart = source.indexOf('<!--', cursor);
    if (commentStart === -1) {
      return output + source.slice(cursor);
    }

    output += source.slice(cursor, commentStart);
    const commentEnd = source.indexOf('-->', commentStart + 4);
    if (commentEnd === -1) {
      throw new Error('unterminated HTML comment');
    }
    const nestedCommentStart = source.indexOf('<!--', commentStart + 4);
    if (nestedCommentStart !== -1 && nestedCommentStart < commentEnd) {
      throw new Error('nested HTML comment opener');
    }
    cursor = commentEnd + 3;
  }

  return output;
}

module.exports = { activeHtml };
