'use strict';

describe('dates.js', function () {
  describe('NewDate', function () {
    describe('new()', function () {
      it('should create a new object', function () {
        const a = dates.newDate('2020-02-28');
        expect(a).to.have.property('isANewDateObject').to.equal(true);
        expect(a.formatDate('YYYY-MM-DD')).to.equal('2020-02-28');
      });

      it('should create a new object with format parameter', function () {
        const a = dates.newDate('2020:28 [02', 'YYYY:DD [MM');
        expect(a).to.have.property('isANewDateObject').to.equal(true);
        expect(a.formatDate('YYYY-MM-DD')).to.equal('2020-02-28');
      });

      it('should return error when date is invalid', function () {
        expect(dates.newDate('2020-04-31').formatDate()).to.equal('Invalid date');
      });
    });

    describe('formatDate()', function () {
      it('should format the object', function () {
        const a = dates.newDate('2020-02-28');
        // expect(a.formatDate()).to.equal('2020-02-28T00:00:00-08:00');
        expect(a.formatDate('YYYY')).to.equal('2020');
        expect(a.formatDate('MM')).to.equal('02');
        expect(a.formatDate('DD')).to.equal('28');
        expect(a.formatDate('MMM D, YYYY')).to.equal('Feb 28, 2020');
        expect(a.formatDate('ddd, MMM D')).to.equal('Fri, Feb 28');
      });

      it('should return error when date is invalid', function () {
        expect(dates.newDate('2020-04-31').formatDate('YYYY-MM-DD')).to.equal('Invalid date');
      });
    });

    describe('getDate()', function () {
      it('should return numeric year', function () {
        const a = dates.newDate('2020-02-28');
        expect(a.getDate('year')).to.equal(2020);
      });

      it('should return numeric month', function () {
        const a = dates.newDate('2020-02-28');
        expect(a.getDate('month')).to.equal(2);
      });

      it('should return numeric date', function () {
        const a = dates.newDate('2020-02-28');
        expect(a.getDate('date')).to.equal(28);
      });

      it('should return numeric day of week', function () {
        const a = dates.newDate('2020-02-28');
        expect(a.getDate('day')).to.equal(5);

        const b = dates.newDate('2020-02-02');
        expect(b.getDate('day')).to.equal(0);

        const c = dates.newDate('2020-02-01');
        expect(c.getDate('day')).to.equal(6);
      });
    });

    describe('addDate()', function () {
      it('should add 1 month', function () {
        expect(dates.newDate('2021-02-28').addDate(1, 'months').formatDate('YYYY-MM-DD')).to.equal('2021-03-28');
        expect(dates.newDate('2020-01-31').addDate(1, 'months').formatDate('YYYY-MM-DD')).to.equal('2020-02-29');
        expect(dates.newDate('2019-12-01').addDate(1, 'months').formatDate('YYYY-MM-DD')).to.equal('2020-01-01');
      });

      it('should add -1 month (or remove 1 month)', function () {
        expect(dates.newDate('2021-02-28').addDate(-1, 'months').formatDate('YYYY-MM-DD')).to.equal('2021-01-28');
        expect(dates.newDate('2020-03-31').addDate(-1, 'months').formatDate('YYYY-MM-DD')).to.equal('2020-02-29');
        expect(dates.newDate('2020-01-01').addDate(-1, 'months').formatDate('YYYY-MM-DD')).to.equal('2019-12-01');
      });

      it('should add 1 year', function () {
        expect(dates.newDate('2020-02-29').addDate(1, 'years').formatDate('YYYY-MM-DD')).to.equal('2021-02-28');
        expect(dates.newDate('2020-01-01').addDate(1, 'years').formatDate('YYYY-MM-DD')).to.equal('2021-01-01');
        expect(dates.newDate('2020-12-31').addDate(1, 'years').formatDate('YYYY-MM-DD')).to.equal('2021-12-31');
      });

      it('should add -1 year (or remove 1 year)', function () {
        expect(dates.newDate('2021-02-28').addDate(-1, 'years').formatDate('YYYY-MM-DD')).to.equal('2020-02-28');
        expect(dates.newDate('2021-01-01').addDate(-1, 'years').formatDate('YYYY-MM-DD')).to.equal('2020-01-01');
        expect(dates.newDate('2021-12-31').addDate(-1, 'years').formatDate('YYYY-MM-DD')).to.equal('2020-12-31');
      });

      it('should add days', function () {
        expect(dates.newDate('2020-12-31').addDate(1, 'days').formatDate('YYYY-MM-DD')).to.equal('2021-01-01');
        expect(dates.newDate('2020-02-28').addDate(1, 'days').formatDate('YYYY-MM-DD')).to.equal('2020-02-29');
        expect(dates.newDate('2020-02-28').addDate(11, 'days').formatDate('YYYY-MM-DD')).to.equal('2020-03-10');
      });

      it('should return error when date is invalid', function () {
        expect(dates.newDate('2020-04-31').addDate(1, 'days').formatDate('YYYY-MM-DD')).to.equal('Invalid date');
      });
    });

    describe('daysInMonthDate()', function () {
      it('should return days in the month', function () {
        expect(dates.newDate('2020-02-01').daysInMonthDate()).to.equal(29);
        expect(dates.newDate('2021-02-01').daysInMonthDate()).to.equal(28);
        expect(dates.newDate('2020-01-01').daysInMonthDate()).to.equal(31);
        expect(dates.newDate('2020-04-01').daysInMonthDate()).to.equal(30);
      });

      it('should returns NaN when date is invalid', function () {
        expect(dates.newDate('2020-04-31').daysInMonthDate()).to.be.NaN;
      });
    });

    describe('cloneDate()', function () {
      it('should clone a date', function () {
        const a = dates.newDate('2020-01-01');
        const b = a.cloneDate().addDate(1, 'days');
        expect(a.formatDate('YYYY-MM-DD')).to.equal('2020-01-01');
        expect(b.formatDate('YYYY-MM-DD')).to.equal('2020-01-02');
      });

      it('should return error when date is invalid', function () {
        const a = dates.newDate('2020-04-31');
        const b = a.cloneDate().addDate(1, 'days');
        expect(a.formatDate('YYYY-MM-DD')).to.equal('Invalid date');
        expect(b.formatDate('YYYY-MM-DD')).to.equal('Invalid date');
      });
    });

    describe('subtractDate()', function () {
      it('should subtract 1 month', function () {
        expect(dates.newDate('2021-02-28').subtractDate(1, 'months').formatDate('YYYY-MM-DD')).to.equal('2021-01-28');
        expect(dates.newDate('2020-03-31').subtractDate(1, 'months').formatDate('YYYY-MM-DD')).to.equal('2020-02-29');
        expect(dates.newDate('2020-01-01').subtractDate(1, 'months').formatDate('YYYY-MM-DD')).to.equal('2019-12-01');
      });

      it('should subtract -1 month (or add 1 month)', function () {
        expect(dates.newDate('2021-02-28').subtractDate(-1, 'months').formatDate('YYYY-MM-DD')).to.equal('2021-03-28');
        expect(dates.newDate('2020-01-31').subtractDate(-1, 'months').formatDate('YYYY-MM-DD')).to.equal('2020-02-29');
        expect(dates.newDate('2019-12-01').subtractDate(-1, 'months').formatDate('YYYY-MM-DD')).to.equal('2020-01-01');
      });

      it('should subtract 1 year', function () {
        expect(dates.newDate('2021-02-28').subtractDate(1, 'years').formatDate('YYYY-MM-DD')).to.equal('2020-02-28');
        expect(dates.newDate('2021-01-01').subtractDate(1, 'years').formatDate('YYYY-MM-DD')).to.equal('2020-01-01');
        expect(dates.newDate('2021-12-31').subtractDate(1, 'years').formatDate('YYYY-MM-DD')).to.equal('2020-12-31');
      });

      it('should subtract -1 year (or add 1 year)', function () {
        expect(dates.newDate('2020-02-29').subtractDate(-1, 'years').formatDate('YYYY-MM-DD')).to.equal('2021-02-28');
        expect(dates.newDate('2020-01-01').subtractDate(-1, 'years').formatDate('YYYY-MM-DD')).to.equal('2021-01-01');
        expect(dates.newDate('2020-12-31').subtractDate(-1, 'years').formatDate('YYYY-MM-DD')).to.equal('2021-12-31');
      });

      it('should subtract days', function () {
        expect(dates.newDate('2021-01-01').subtractDate(1, 'days').formatDate('YYYY-MM-DD')).to.equal('2020-12-31');
        expect(dates.newDate('2020-03-01').subtractDate(1, 'days').formatDate('YYYY-MM-DD')).to.equal('2020-02-29');
        expect(dates.newDate('2020-03-10').subtractDate(11, 'days').formatDate('YYYY-MM-DD')).to.equal('2020-02-28');
      });

      it('should return error when date is invalid', function () {
        expect(dates.newDate('2020-04-31').subtractDate(1, 'days').formatDate('YYYY-MM-DD')).to.equal('Invalid date');
      });
    });

    describe('diffDate()', function () {
      it('should return the difference in days', function () {
        expect(dates.newDate('2020-01-01').diffDate('2020-01-01', 'days')).to.equal(0);
        expect(dates.newDate('2020-01-02').diffDate('2020-01-01', 'days')).to.equal(1);
        expect(dates.newDate('2020-01-01').diffDate('2020-01-02', 'days')).to.equal(-1);
        expect(dates.newDate('2020-01-01').diffDate('2019-12-31', 'days')).to.equal(1);
      });

      it('should return error when date is invalid', function () {
        expect(dates.newDate('2020-04-31').diffDate('2020-04-30', 'days')).to.be.NaN;
        expect(dates.newDate('2020-04-30').diffDate('2020-04-31', 'days')).to.be.NaN;
      });
    });
  });

  describe('Dates', function () {
    describe('formatOnce()', function () {
      it('should format the date', function () {
        expect(dates.formatOnce('2020-01-01', 'YYYY')).to.equal('2020');
        expect(dates.formatOnce('2020-01-01', 'MM')).to.equal('01');
        expect(dates.formatOnce('2020-01-01', 'DD')).to.equal('01');
        expect(dates.formatOnce('2020-01-01', 'MMM D, YYYY')).to.equal('Jan 1, 2020');
        expect(dates.formatOnce('2020-01-01', 'ddd, MMM D')).to.equal('Wed, Jan 1');
      });

      it('should return error when date is invalid', function () {
        expect(dates.formatOnce('2020-13-01', 'DD')).to.equal('Invalid date');
      });
    });

    describe('diffOnce()', function () {
      it('should return the difference in days', function () {
        expect(dates.diffOnce('2020-01-01', '2020-01-01', 'days')).to.equal(0);
        expect(dates.diffOnce('2020-01-02', '2020-01-01', 'days')).to.equal(1);
        expect(dates.diffOnce('2020-01-01', '2020-01-02', 'days')).to.equal(-1);
        expect(dates.diffOnce('2020-01-01', '2019-12-31', 'days')).to.equal(1);
      });

      it('should return error when date is invalid', function () {
        expect(dates.diffOnce('2020-04-31', '2020-04-30', 'days')).to.be.NaN;
        expect(dates.diffOnce('2020-04-30', '2020-04-31', 'days')).to.be.NaN;
      });
    });

    describe('isValid()', function () {
      it('should return true with valid date', function () {
        expect(dates.isValid('2020-01-01')).to.equal(true);
        expect(dates.isValid('2020-02-29')).to.equal(true);
      });

      it('should return false with invalid date', function () {
        expect(dates.isValid('2020-13-01')).to.equal(false);
        expect(dates.isValid('2020-04-31')).to.equal(false);
        expect(dates.isValid('2021-02-29')).to.equal(false);
      });
    });

    describe('weekdaysShort()', function () {
      it('should return the list of weekdays', function () {
        expect(dates.weekdaysShort()).to.eql(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      });
    });

    describe('newDate()', function () {
      it('should create a new object', function () {
        const a = dates.newDate('2020-02-28');
        expect(a).to.have.property('isANewDateObject').to.equal(true);
        expect(a.formatDate('YYYY-MM-DD')).to.equal('2020-02-28');
      });

      it('should create a new object with format parameter', function () {
        const a = dates.newDate('2020:28 [02', 'YYYY:DD [MM');
        expect(a).to.have.property('isANewDateObject').to.equal(true);
        expect(a.formatDate('YYYY-MM-DD')).to.equal('2020-02-28');
      });

      it('should return error when date is invalid', function () {
        expect(dates.newDate('2020-04-31').formatDate()).to.equal('Invalid date');
      });
    });
  });
});
