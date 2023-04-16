'use strict';

describe('storage.js', function () {
  let testStorage;
  const testNamespace = '_TEST_';

  before(function () {
    testStorage = new app.Storage(testNamespace);
  });

  describe('setItem()', function () {
    it('should successfully set an item with an empty key', function () {
      testStorage.setItem('', { test: '1' });
      expect(localStorage[testNamespace]).to.equal('{"test":"1"}');
    });

    it('should successfully set an item with a not empty key', function () {
      testStorage.setItem('giulia', { test: '1' });
      expect(localStorage[testNamespace + 'Giulia']).to.equal('{"test":"1"}');
    });
  });

  describe('getItem()', function () {
    it('should successfully get an item with an empty key', function () {
      expect(testStorage.getItem('')).to.eql({ test: '1' });
    });

    it('should successfully get an item with a not empty key', function () {
      expect(testStorage.getItem('giulia')).to.eql({ test: '1' });
    });
  });

  describe('removeItem()', function () {
    it('should successfully remove an item with an empty key', function () {
      expect(localStorage[testNamespace]).to.equal('{"test":"1"}');
      expect(testStorage.removeItem('')).to.be.undefined;
      expect(testStorage.getItem('')).to.be.null;
      expect(localStorage[testNamespace]).to.be.undefined;
    });

    it('should successfully remove an item with a not empty key', function () {
      expect(localStorage[testNamespace + 'Giulia']).to.equal('{"test":"1"}');
      expect(testStorage.removeItem('giulia')).to.be.undefined;
      expect(testStorage.getItem('giulia')).to.be.null;
      expect(localStorage[testNamespace + 'Giulia']).to.be.undefined;
    });
  });

  describe('clear()', function () {
    it('should clear all items in the namespace', function () {
      testStorage.setItem('', { test: '1' });
      testStorage.setItem('giulia2', { test: '2' });
      testStorage.setItem('_giulia2', { test: '3' });

      expect(localStorage[testNamespace]).to.equal('{"test":"1"}');
      expect(localStorage[testNamespace + 'Giulia2']).to.equal('{"test":"2"}');
      expect(localStorage[testNamespace + '_giulia2']).to.equal('{"test":"3"}');

      testStorage.clear();

      expect(localStorage[testNamespace]).to.be.undefined;
      expect(localStorage[testNamespace + 'Giulia2']).to.be.undefined;
      expect(localStorage[testNamespace + '_giulia2']).to.be.undefined;
    });
  });
});
