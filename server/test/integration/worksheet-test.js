const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const Workbook = require('../../src/xls/index');

describe('Integration - xls/index', function (){
    
    describe('readSpreadsheet', async () => {

        it('should populate its children and validate its fields - sheets stubbed', async () => {
            dummySchedule = dummyRoster = dummyServices = { load(){}};
            let workbook = new Workbook(dummySchedule, dummyRoster, dummyServices);
            workbook.loadFromFile('../db/Deacons-2019.xlsx');
        });

        it('should populate its children and validate its fields - full stack', async () => {
            let workbook = new Workbook();
            workbook.loadFromFile('../db/Deacons-2019.xlsx');
        });

        it('should fail if the sheets don\'t exist - sheets stubbed', async () => {
            dummySchedule = dummyRoster = dummyServices = { load(){}};
            let workbook = new Workbook(dummySchedule, dummyRoster, dummyServices);
            expect(() => workbook.loadFromFile('test/data/EmptySpreadsheet.xlsx'))
            .throws(/Workbook has invalid structure/);
        });

        it('should fail if the sheets don\'t exist - full stack', async () => {
            let workbook = new Workbook();
            expect(() => workbook.loadFromFile('test/data/EmptySpreadsheet.xlsx'))
                .throws(/Workbook has invalid structure/);
            
        });

        it('should delegate all checking of sheet content to the sheets', async () => {
            dummySchedule = dummyRoster = dummyServices = { load(){}};
            let workbook = new Workbook(dummySchedule, dummyRoster, dummyServices);
            expect(() => workbook.loadFromFile('test/data/EmptySheets.xlsx'))
                .does.not.throw();
        });

        it('should aggregate failures from sheets', async () => {
            dummySchedule = { load(){ throw new Error('A'); }};
            dummyRoster =   { load(){ throw new Error('B'); }};
            dummyServices = { load(){ throw new Error('C'); }};
            let workbook = new Workbook(dummySchedule, dummyRoster, dummyServices);
            expect(() => workbook.loadFromFile('test/data/EmptySheets.xlsx'))
                .throws("A\r\nB\r\nC");
        });

    });
});
