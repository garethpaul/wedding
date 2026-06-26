'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { activeHtml } = require('./html_contracts');

const root = path.resolve(__dirname, '..');

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

describe('repository status', () => {
  it('documents the maintained tree as historical and local-only', () => {
    const requiredStatus = 'The maintained repository is a historical, local-only site. It is not currently deployable from this tree.';

    for (const fileName of ['README.md', 'LOCAL_DEVELOPMENT.md', 'VISION.md', 'SECURITY.md']) {
      const source = fs.readFileSync(path.join(root, fileName), 'utf8').replace(/\s+/g, ' ');
      assert.ok(source.includes(requiredStatus), `${fileName} must state the local-only repository status`);
    }
  });
});
