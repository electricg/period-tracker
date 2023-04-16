'use strict';

describe('helpers.js', function () {
  describe('today', function () {
    it('should be accessed but not overwritten', function () {
      expect(helpers.today).to.not.be.undefined;
      function badFn() {
        helpers.today = 'test';
      }
      expect(badFn).to.throw();
    });
  });

  describe('todayStr', function () {
    it('should be accessed but not overwritten', function () {
      expect(helpers.todayStr).to.not.be.undefined;
      function badFn() {
        helpers.todayStr = 'test';
      }
      expect(badFn).to.throw();
    });
  });

  describe('datePattern', function () {
    it('should be accessed but not overwritten', function () {
      expect(helpers.datePattern).to.not.be.undefined;
      function badFn() {
        helpers.datePattern = 'test';
      }
      expect(badFn).to.throw();
    });
  });

  describe('z()', function () {
    it('should return the exact same input when is not a number or a string', function () {
      expect(helpers.z(true)).to.equal(true);
      expect(helpers.z(false)).to.equal(false);
      expect(helpers.z({ test: 1 })).to.eql({ test: 1 });
      expect(helpers.z([1, 2, 3, 'a'])).to.eql([1, 2, 3, 'a']);
    });

    it('should return the same input when is a string not formattable into a number', function () {
      expect(helpers.z('')).to.equal('');
      expect(helpers.z('a')).to.equal('a');
      expect(helpers.z('test')).to.equal('test');
      expect(helpers.z('a1')).to.equal('a1');
      expect(helpers.z('1b')).to.equal('1b');
    });

    it('should return the input in a string format with leading zero when is a string formattable into a number', function () {
      expect(helpers.z('0')).to.equal('0');
      expect(helpers.z('00')).to.equal('0');
      expect(helpers.z('1')).to.equal('01');
      expect(helpers.z('9')).to.equal('09');
      expect(helpers.z('09')).to.equal('09');
      expect(helpers.z('10')).to.equal('10');
      expect(helpers.z('-1')).to.equal('-1');
      expect(helpers.z('-9')).to.equal('-9');
      expect(helpers.z('-10')).to.equal('-10');
    });

    it('should return the input in a string format without leading zero when input is a number not between 0 and 10 excluded', function () {
      expect(helpers.z(0)).to.equal('0');
      expect(helpers.z(10)).to.equal('10');
      expect(helpers.z(123)).to.equal('123');
      expect(helpers.z(-1)).to.equal('-1');
      expect(helpers.z(-10)).to.equal('-10');
      expect(helpers.z(-123)).to.equal('-123');
    });

    it('should return the input in a string format with leading zero when input is a number between 0 and 10 excluded', function () {
      expect(helpers.z(1)).to.equal('01');
      expect(helpers.z(5)).to.equal('05');
      expect(helpers.z(9)).to.equal('09');
    });
  });

  describe('$delegate()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('readFromInputFile()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('writeToFile()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('shareTo()', function () {
    it('TODO', function () {
      expect(123).to.equal(123);
    });
  });

  describe('uid()', function () {
    it('should have only digits', function () {
      const regex = new RegExp(/^\d+$/);
      const str = helpers.uid();
      expect(regex.test('.123')).to.be.false; // check the regex
      expect(regex.test(str)).to.be.true;
    });

    it('should create two different ids', function () {
      const a = helpers.uid();
      const b = helpers.uid();
      expect(a !== b).to.be.true;
    });
  });
});
