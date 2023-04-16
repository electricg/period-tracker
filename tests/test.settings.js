'use strict';

describe('settings.js', function () {
  it('should not overwrite `VERSION`', function () {
    function badFn() {
      VERSION = null;
    }
    expect(badFn).to.throw();
  });

  it('should not overwrite `NAMESPACE`', function () {
    function badFn() {
      NAMESPACE = null;
    }
    expect(badFn).to.throw();
  });

  it('should not overwrite `DEFAULT_USER_SETTINGS`', function () {
    function badFn() {
      DEFAULT_USER_SETTINGS = null;
    }
    expect(badFn).to.throw();
  });

  it('should not overwrite `DEFAULT_USER_SETTINGS` props', function () {
    function badFn() {
      DEFAULT_USER_SETTINGS.test = null;
    }
    expect(badFn).to.throw();
  });

  it('should not overwrite `FEATURES`', function () {
    function badFn() {
      FEATURES = null;
    }
    expect(badFn).to.throw();
  });

  it('should not overwrite `FEATURES` props', function () {
    function badFn() {
      FEATURES.test = null;
    }
    expect(badFn).to.throw();
  });

  it('should not overwrite `FILE`', function () {
    function badFn() {
      FILE = null;
    }
    expect(badFn).to.throw();
  });

  it('should not overwrite `FILE` props', function () {
    function badFn() {
      FILE.test = null;
    }
    expect(badFn).to.throw();
  });
});
