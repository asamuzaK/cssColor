/**
 * css-var.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';

/* test */
import * as custom from '../src/js/css-var.js';

describe('resolve custom variable', () => {
  const func = custom.isColor;

  beforeEach(() => {
    custom.cachedResults.clear();
  });
  afterEach(() => {
    custom.cachedResults.clear();
  });

  it('should get result', () => {
    const res = func();
    assert.strictEqual(res, false, 'result');
  });

  it('should get result', () => {
    const res = func('foo');
    assert.strictEqual(res, false, 'result');
  });

  it('should get result', () => {
    const res = func('red');
    assert.strictEqual(res, true, 'result');
  });

  it('should get result', () => {
    const res = func('currentcolor');
    assert.strictEqual(res, true, 'result');
  });

  it('should get result', () => {
    const res = func('transparent');
    assert.strictEqual(res, true, 'result');
  });

  it('should get result', () => {
    const res = func('color(srgb 0 127.5 0)');
    assert.strictEqual(res, true, 'result');
  });

  it('should get result', () => {
    const res = func('color-mix(in oklab, red, blue)');
    assert.strictEqual(res, true, 'result');
  });
});

describe('resolve CSS variable', () => {
  const func = custom.resolveCssVariable;

  beforeEach(() => {
    custom.cachedResults.clear();
  });
  afterEach(() => {
    custom.cachedResults.clear();
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      [')-token', ')']
    ]);
    assert.deepEqual(res, [
      [],
      undefined
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')']
    ]);
    assert.deepEqual(res, [
      [],
      'red'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ]);
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'red'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'blue'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'blue'
    ], 'result');
  });

  it('should get value', () => {
    const getPropertyValue = v => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        default:
      }
      return res;
    };
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        callback: getPropertyValue
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'blue'
    ], 'result');
  });

  it('should get value', () => {
    const getPropertyValue = v => {
      let res;
      switch (v) {
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        callback: getPropertyValue
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'red'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--FOO'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'blue'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'red'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': '20px'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'red'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--bar': 'blue'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'red'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'currentColor'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'currentColor'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'var(--bar)',
        '--bar': 'blue'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'blue'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'var(--bar)',
        '--bar': 'initial'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'red'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', '10px'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'var(--bar)',
        '--bar': '20px'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      '20px'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'rgb(255 0 calc(255 / 2))'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'rgb(255 0 127.5)'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'color-mix(in oklab, rgb(255 0 0), green)'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'color-mix(in oklab, rgb(255 0 0), green)'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'transparent'
      }
    });
    assert.deepEqual(res, [
      [
        [
          ')-token',
          ')'
        ]
      ],
      'transparent'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'blue'
      }
    });
    assert.deepEqual(res, [
      [],
      'blue'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'calc(1 / 2)'
      }
    });
    assert.deepEqual(res, [
      [],
      'red'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', '1'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'calc(1 / 2)'
      }
    });
    assert.deepEqual(res, [
      [],
      '0.5'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      [')-token', ')']
    ], {
      customProperty: {
        '--foo': 'initial'
      }
    });
    assert.deepEqual(res, [
      [],
      'red'
    ], 'result');
  });
});

describe('parse tokens', () => {
  const func = custom.parseTokens;

  beforeEach(() => {
    custom.cachedResults.clear();
  });
  afterEach(() => {
    custom.cachedResults.clear();
  });

  it('should get null', () => {
    const res = func([
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      [')-token', ')']
    ]);
    assert.deepEqual(res, null, 'result');
  });

  it('should get value', () => {
    const res = func([
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')']
    ]);
    assert.deepEqual(res, ['red'], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['function-token', 'calc('],
      ['whitespace-token', ' '],
      ['function-token', 'var('],
      ['ident-token', '--foo'],
      ['comma-token', ','],
      ['whitespace-token', ' '],
      ['ident-token', 'red'],
      [')-token', ')'],
      ['whitespace-token', ' '],
      [')-token', ')']
    ]);
    assert.deepEqual(res, [
      'calc(',
      'red',
      ')'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      ['ident-token', '--foo'],
      [')-token', ')'],
      ['whitespace-token', ' '],
      [')-token', ')']
    ]);
    assert.deepEqual(res, [
      '--foo',
      ')',
      ')'
    ], 'result');
  });

  it('should get value', () => {
    const res = func([
      [')-token', ')'],
    ]);
    assert.deepEqual(res, [
      ')'
    ], 'result');
  });
});

describe('resolve CSS var()', () => {
  const func = custom.cssVar;

  beforeEach(() => {
    custom.cachedResults.clear();
  });
  afterEach(() => {
    custom.cachedResults.clear();
  });

  it('should throw', () => {
    assert.throws(() => func(), TypeError,
      'Expected String but got Undefined.');
  });

  it('should get value', () => {
    const res = func('foo');
    assert.strictEqual(res, 'foo', 'result');
  });

  it('should get null', () => {
    const res = func('var(--foo)');
    assert.deepEqual(res, null, 'result');

    const res2 = func('var(--foo)');
    assert.deepEqual(res2, null, 'result');
  });

  it('should get value', () => {
    const res = func('var(--foo)', {
      customProperty: {
        '--foo': 'red'
      }
    });
    assert.strictEqual(res, 'red', 'result');

    const res2 = func('var(--foo)', {
      customProperty: {
        '--foo': 'red'
      }
    });
    assert.strictEqual(res2, 'red', 'result');
  });

  it('should get value', () => {
    const getPropertyValue = v => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--foo)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    assert.strictEqual(res, 'blue', 'result');

    const res2 = func('var(--foo)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    assert.strictEqual(res2, 'blue', 'result');
  });

  it('should get value', () => {
    const getPropertyValue = v => {
      let res;
      switch (v) {
        case '--foo':
          res = 'blue';
          break;
        case '--bar':
          res = 'green';
          break;
        case '--baz':
          res = 'yellow';
          break;
        default:
      }
      return res;
    };
    const res = func('var(--qux, red)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    assert.strictEqual(res, 'red', 'result');

    const res2 = func('var(--qux, red)', {
      customProperty: {
        callback: getPropertyValue
      }
    });
    assert.strictEqual(res2, 'red', 'result');
  });

  it('should get value', () => {
    const res = func('rgb( 0 calc( var( --max-rgb ) * var( --half ) ) 0 )', {
      customProperty: {
        '--half': '.5',
        '--max-rgb': '255'
      }
    });
    assert.strictEqual(res, 'rgb(0 127.5 0)', 'result');

    const res2 = func('rgb( 0 calc( var( --max-rgb ) * var( --half ) ) 0 )', {
      customProperty: {
        '--half': '.5',
        '--max-rgb': '255'
      }
    });
    assert.strictEqual(res2, 'rgb(0 127.5 0)', 'result');
  });
});
