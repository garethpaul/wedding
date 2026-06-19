'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { activeHtml } = require('./html_contracts');

describe('activeHtml', () => {
  it('removes complete HTML comments without changing active markup', () => {
    assert.equal(activeHtml('<a>before</a><!-- retired --><a>after</a>'), '<a>before</a><a>after</a>');
  });

  it('rejects nested comment openers that could hide active markup', () => {
    assert.throws(() => activeHtml('<!-- retired <!-- <script> --><p>active</p>'), /nested HTML comment/);
  });

  it('rejects unterminated comments', () => {
    assert.throws(() => activeHtml('<p>active</p><!-- retired'), /unterminated HTML comment/);
  });
});
