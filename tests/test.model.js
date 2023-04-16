'use strict';

describe('model.js', function () {
  const testNamespace = '_TEST_';
  let testModel;
  let testConfig;
  let testStorage;

  const testDefaultSettings = {
    periodLength: 4,
    cycleLength: 28,
  };
  Object.freeze(testDefaultSettings);

  describe('init()', function () {
    before(function () {
      testStorage = new app.Storage(testNamespace);
      testConfig = new app.Config(testDefaultSettings, testStorage);
      testModel = new app.Model(testConfig, testStorage);
    });

    it('should start with zero data', function () {
      expect(testModel.list).to.eql([]);
      expect(testModel.quicklist).to.eql([]);
      expect(testModel.intervals).to.eql([]);
      expect(testModel.average).to.equal(testDefaultSettings.cycleLength);
      expect(testModel.next).to.equal('');
      expect(testModel.countdown).to.equal(0);
      expect(testModel.counter).to.equal(0);
    });

    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('calc()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('add()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('edit()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('remove()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('clear()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('update()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('getById()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });
});
