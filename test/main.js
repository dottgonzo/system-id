var mocha = require('mocha'), assert = require('chai').assert;
var SysId = require('../index');
var serialpath = '/tmp/tokentest';
var serial = new SysId(serialpath);
describe('configuration', function () {
    describe('check basic existence', function () {
        it('must return something', function () {
            assert.ok(serial, 'torna');
        });
    });
    describe('check if is an object', function () {
        it('must be an object', function () {
            assert.isObject(serial, 'serial file is an object');
        });
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQzVCLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ2hDLElBQU8sS0FBSyxXQUFTLFVBQVUsQ0FBQyxDQUFDO0FBQ2pDLElBQUksVUFBVSxHQUFDLGdCQUFnQixDQUFDO0FBQ2hDLElBQUksTUFBTSxHQUFDLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWpDLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBRWxDLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRTtZQUMxQixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBRWhDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtZQUV4QixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0L21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbW9jaGEgPSByZXF1aXJlKCdtb2NoYScpLFxuYXNzZXJ0ID0gcmVxdWlyZSgnY2hhaScpLmFzc2VydDtcbmltcG9ydCBTeXNJZD1yZXF1aXJlKCcuLi9pbmRleCcpO1xudmFyIHNlcmlhbHBhdGg9Jy90bXAvdG9rZW50ZXN0JztcbnZhciBzZXJpYWw9bmV3IFN5c0lkKHNlcmlhbHBhdGgpO1xuXG5kZXNjcmliZSgnY29uZmlndXJhdGlvbicsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnY2hlY2sgYmFzaWMgZXhpc3RlbmNlJywgZnVuY3Rpb24oKSB7XG5cbiAgaXQoJ211c3QgcmV0dXJuIHNvbWV0aGluZycsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC5vayhzZXJpYWwsJ3Rvcm5hJyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjaGVjayBpZiBpcyBhbiBvYmplY3QnLCBmdW5jdGlvbigpIHtcblxuICBpdCgnbXVzdCBiZSBhbiBvYmplY3QnLCBmdW5jdGlvbigpIHtcblxuICBhc3NlcnQuaXNPYmplY3Qoc2VyaWFsLCAnc2VyaWFsIGZpbGUgaXMgYW4gb2JqZWN0Jyk7XG4gIH0pO1xufSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
