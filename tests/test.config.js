'use strict';

describe('config.js', function () {
  const testNamespace = '_TEST_';

  after(function () {
    localStorage.removeItem(testNamespace + 'Config');
  });

  describe('with default options and empty storage', function () {
    let testStorage;
    let testConfig;

    const testDefaultSettings = {
      periodLength: 4,
      cycleLength: 28,
    };
    Object.freeze(testDefaultSettings);

    before(function () {
      localStorage.removeItem(testNamespace + 'Config');
      testStorage = new app.Storage(testNamespace);
      testConfig = new app.Config(testDefaultSettings, testStorage);
    });

    it('should load with default properties', function () {
      expect(testConfig.getAll()).to.eql(testDefaultSettings);
    });

    describe('update()', function () {
      it('should update successfully a property', function () {
        testConfig.update({ cycleLength: 1 });
        expect(testConfig.getAll()).to.eql({ periodLength: 4, cycleLength: 1 });
        expect(localStorage[testNamespace + 'Config']).to.equal('{"periodLength":4,"cycleLength":1}');
      });
    });

    describe('reset()', function () {
      it('should reset successfully', function () {
        testConfig.update({ cycleLength: 1 });
        expect(testConfig.getAll()).to.eql({ periodLength: 4, cycleLength: 1 });
        testConfig.reset();
        expect(testConfig.getAll()).to.eql(testDefaultSettings);
        expect(localStorage[testNamespace + 'Config']).to.equal('{"periodLength":4,"cycleLength":28}');
      });
    });

    describe('get()', function () {
      it('should return undefined for an unkown property', function () {
        expect(testConfig.get('giulia')).to.be.undefined;
      });

      it('should return successfully for a property', function () {
        expect(testConfig.get('cycleLength')).to.equal(28);
      });
    });

    describe('getAll()', function () {
      it('should return successfully all the properties', function () {
        testConfig.update({ cycleLength: 1 });
        expect(testConfig.getAll()).to.eql({ periodLength: 4, cycleLength: 1 });
      });
    });
  });

  describe('with default options and not empty storage', function () {
    let testStorage;
    let testConfig;

    const testDefaultSettings = {
      periodLength: 4,
      cycleLength: 28,
    };
    Object.freeze(testDefaultSettings);

    before(function () {
      localStorage.removeItem(testNamespace + 'Config');
      localStorage.setItem(testNamespace + 'Config', JSON.stringify({ cycleLength: 30 }));
      testStorage = new app.Storage(testNamespace);
      testConfig = new app.Config(testDefaultSettings, testStorage);
    });

    it('should load with default properties and localstorage values merged', function () {
      expect(testConfig.getAll()).to.eql({ periodLength: 4, cycleLength: 30 });
    });

    describe('update()', function () {
      it('should update successfully a property', function () {
        testConfig.update({ cycleLength: 1 });
        expect(testConfig.getAll()).to.eql({ periodLength: 4, cycleLength: 1 });
        expect(localStorage[testNamespace + 'Config']).to.equal('{"periodLength":4,"cycleLength":1}');
      });
    });

    describe('reset()', function () {
      it('should reset successfully', function () {
        testConfig.update({ cycleLength: 1 });
        expect(testConfig.getAll()).to.eql({ periodLength: 4, cycleLength: 1 });
        testConfig.reset();
        expect(testConfig.getAll()).to.eql(testDefaultSettings);
        expect(localStorage[testNamespace + 'Config']).to.equal('{"periodLength":4,"cycleLength":28}');
      });
    });

    describe('get()', function () {
      it('should return undefined for an unkown property', function () {
        expect(testConfig.get('giulia')).to.be.undefined;
      });

      it('should return successfully for a property', function () {
        testConfig.update({ cycleLength: 33 });
        expect(testConfig.get('cycleLength')).to.equal(33);
      });
    });

    describe('getAll()', function () {
      it('should return successfully all the properties', function () {
        testConfig.update({ cycleLength: 1 });
        expect(testConfig.getAll()).to.eql({ periodLength: 4, cycleLength: 1 });
      });
    });
  });

  describe('with empty default options and empty storage', function () {
    let testStorage;
    let testConfig;

    before(function () {
      localStorage.removeItem(testNamespace + 'Config');
      testStorage = new app.Storage(testNamespace);
      testConfig = new app.Config({}, testStorage);
    });

    it('should load with no properties', function () {
      expect(testConfig.getAll()).to.eql({});
    });

    describe('update()', function () {
      it('should update nothing', function () {
        testConfig.update({ cycleLength: 1 });
        expect(testConfig.getAll()).to.eql({});
        expect(localStorage[testNamespace + 'Config']).to.equal('{}');
      });
    });

    describe('reset()', function () {
      it('should reset nothing', function () {
        testConfig.update({ cycleLength: 1 });
        testConfig.reset();
        expect(testConfig.getAll()).to.eql({});
        expect(localStorage[testNamespace + 'Config']).to.equal('{}');
      });
    });

    describe('get()', function () {
      it('should return undefined for an unkown property', function () {
        expect(testConfig.get('giulia')).to.be.undefined;
      });

      it('should return undefined for a property', function () {
        expect(testConfig.get('cycleLength')).to.be.undefined;
      });
    });

    describe('getAll()', function () {
      it('should return empty object', function () {
        expect(testConfig.getAll()).to.eql({});
      });
    });
  });

  describe('with empty default options and not empty storage', function () {
    let testStorage;
    let testConfig;

    before(function () {
      localStorage.removeItem(testNamespace + 'Config');
      testStorage = new app.Storage(testNamespace);
      testStorage.setItem('config', { cycleLength: 2 });
      testConfig = new app.Config({}, testStorage);
    });

    it('should load with no properties', function () {
      expect(testConfig.getAll()).to.eql({});
    });

    describe('update()', function () {
      it('should update nothing', function () {
        testConfig.update({ cycleLength: 1 });
        expect(testConfig.getAll()).to.eql({});
        expect(localStorage[testNamespace + 'Config']).to.equal('{}');
      });
    });

    describe('reset()', function () {
      it('should reset nothing', function () {
        testConfig.update({ cycleLength: 1 });
        testConfig.reset();
        expect(testConfig.getAll()).to.eql({});
        expect(localStorage[testNamespace + 'Config']).to.equal('{}');
      });
    });

    describe('get()', function () {
      it('should return undefined for an unkown property', function () {
        expect(testConfig.get('giulia')).to.be.undefined;
      });

      it('should return undefined for a property', function () {
        expect(testConfig.get('cycleLength')).to.be.undefined;
      });
    });

    describe('getAll()', function () {
      it('should return empty object', function () {
        expect(testConfig.getAll()).to.eql({});
      });
    });
  });
});
