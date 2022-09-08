describe('calendar.js', function () {
  describe('_calendarChrome', function () {
    const today = new Date();
    const todayObj = {
      monthN: today.toLocaleString(undefined, { month: 'numeric' }),
      yearN: today.toLocaleString(undefined, { year: 'numeric' }),
      title: today.toLocaleString(undefined, { month: 'long', year: 'numeric' }),
    };

    const cases = [
      {
        input: {
          startDayOfWeek: 1,
          selectedMonthN: '9',
          selectedYearN: '2022',
        },
        output: {
          title: 'September 2022',
          weekTitle: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          nextMonthObj: {
            monthN: '10',
            yearN: '2022',
            title: 'October 2022',
          },
          prevMonthObj: {
            monthN: '8',
            yearN: '2022',
            title: 'August 2022',
            daysInMonth: 31,
          },
          nextYearObj: {
            monthN: '9',
            yearN: '2023',
            title: 'September 2023',
          },
          prevYearObj: {
            monthN: '9',
            yearN: '2021',
            title: 'September 2021',
          },
          todayObj,
        },
      },
      {
        input: {
          startDayOfWeek: 6,
          selectedMonthN: '9',
          selectedYearN: '2022',
        },
        output: {
          title: 'September 2022',
          weekTitle: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          nextMonthObj: {
            monthN: '10',
            yearN: '2022',
            title: 'October 2022',
          },
          prevMonthObj: {
            monthN: '8',
            yearN: '2022',
            title: 'August 2022',
            daysInMonth: 31,
          },
          nextYearObj: {
            monthN: '9',
            yearN: '2023',
            title: 'September 2023',
          },
          prevYearObj: {
            monthN: '9',
            yearN: '2021',
            title: 'September 2021',
          },
          todayObj,
        },
      },
      {
        input: {
          startDayOfWeek: 0,
          selectedMonthN: '2',
          selectedYearN: '2020',
        },
        output: {
          title: 'February 2020',
          weekTitle: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          nextMonthObj: {
            monthN: '3',
            yearN: '2020',
            title: 'March 2020',
          },
          prevMonthObj: {
            monthN: '1',
            yearN: '2020',
            title: 'January 2020',
            daysInMonth: 31,
          },
          nextYearObj: {
            monthN: '2',
            yearN: '2021',
            title: 'February 2021',
          },
          prevYearObj: {
            monthN: '2',
            yearN: '2019',
            title: 'February 2019',
          },
          todayObj,
        },
      },
      {
        input: {
          startDayOfWeek: 0,
          selectedMonthN: '5',
          selectedYearN: '2022',
        },
        output: {
          title: 'May 2022',
          weekTitle: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          nextMonthObj: {
            monthN: '6',
            yearN: '2022',
            title: 'June 2022',
          },
          prevMonthObj: {
            monthN: '4',
            yearN: '2022',
            title: 'April 2022',
            daysInMonth: 30,
          },
          nextYearObj: {
            monthN: '5',
            yearN: '2023',
            title: 'May 2023',
          },
          prevYearObj: {
            monthN: '5',
            yearN: '2021',
            title: 'May 2021',
          },
          todayObj,
        },
      },
      {
        input: {
          startDayOfWeek: 0,
          selectedMonthN: '12',
          selectedYearN: '2021',
        },
        output: {
          title: 'December 2021',
          weekTitle: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          nextMonthObj: {
            monthN: '1',
            yearN: '2022',
            title: 'January 2022',
          },
          prevMonthObj: {
            monthN: '11',
            yearN: '2021',
            title: 'November 2021',
            daysInMonth: 30,
          },
          nextYearObj: {
            monthN: '12',
            yearN: '2022',
            title: 'December 2022',
          },
          prevYearObj: {
            monthN: '12',
            yearN: '2020',
            title: 'December 2020',
          },
          todayObj,
        },
      },
      {
        input: {
          startDayOfWeek: 0,
          selectedMonthN: '1',
          selectedYearN: '2022',
        },
        output: {
          title: 'January 2022',
          weekTitle: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          nextMonthObj: {
            monthN: '2',
            yearN: '2022',
            title: 'February 2022',
          },
          prevMonthObj: {
            monthN: '12',
            yearN: '2021',
            title: 'December 2021',
            daysInMonth: 31,
          },
          nextYearObj: {
            monthN: '1',
            yearN: '2023',
            title: 'January 2023',
          },
          prevYearObj: {
            monthN: '1',
            yearN: '2021',
            title: 'January 2021',
          },
          todayObj,
        },
      },
    ];

    cases.forEach((item) => {
      it(`should work for ${item.output.title}`, function () {
        const { startDayOfWeek, selectedMonthN, selectedYearN } = item.input;
        const test = calendar._calendarChrome(startDayOfWeek, selectedMonthN, selectedYearN);
        expect(test).to.eql(item.output);
      });
    });
  });
});
