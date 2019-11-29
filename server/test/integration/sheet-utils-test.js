const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const XLSX = require('xlsx');
const Utils = require('../../src/xls/sheet-utils');

describe('Integration - xls/sheet-utils', function (){

    describe('columnAsNumber, columnAsLetter', () => {

        it('should be transitive for any column', () => {
            expect (Utils.columnAsLetter(Utils.columnAsNumber('A'))).equals('A');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('M'))).equals('M');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('Z'))).equals('Z');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('AA'))).equals('AA');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('AZ'))).equals('AZ');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('BA'))).equals('BA');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('ZZ'))).equals('ZZ');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('AAA'))).equals('AAA');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('MMMMM'))).equals('MMMMM');
        });
        it('should be sequential for any column', () => {
            expect (Utils.columnAsLetter(Utils.columnAsNumber('A')+1)).equals('B');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('M')+1)).equals('N');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('Z')+1)).equals('AA');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('AA')+1)).equals('AB');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('AZ')+1)).equals('BA');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('BA')+1)).equals('BB');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('ZZ')+1)).equals('AAA');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('AAA')+1)).equals('AAB');
            expect (Utils.columnAsLetter(Utils.columnAsNumber('MMMMM')+1)).equals('MMMMN');
        });
    })
    
    describe('offset', () => {

        it('should return a valid cell when offsets are valid', () => {
            expect(Utils.offset('A1',2,3)).equals('C4');
            expect(Utils.offset('D6',-3,-2)).equals('A4');
            expect(Utils.offset('Z2',1,-1)).equals('AA1');
        });
        it('should return null when cell is valid', () => {
            expect(Utils.offset('#@',2,3)).equals(null);
        });
        it('should return null when x offset is invalid', () =>{
            expect(Utils.offset('A6',-3,0)).equals(null);
        })
        it('should return null when y offset is invalid', () =>{
            expect(Utils.offset('B2',1,-3)).equals(null);
        })

    })

    describe('distance', () => {

        it('should return a valid distance when cells are valid', () =>{
            let [x,y] = Utils.distance('A3','C4');
            expect(x).equals(2);
            expect(y).equals(1);
            [x,y] = Utils.distance('AB6','Z2');
            expect(x).equals(-2);
            expect(y).equals(-4);
        })
        it('should return null when cells are invalid', () =>{
            expect(Utils.distance('@#','C4')).equals(null);
            expect(Utils.distance('A3','@#')).equals(null);
        })

    })

    describe('findCellNameByContent', () => {

        it('should find data in sheet where present', () => {
            const workbook = XLSX.readFile('test/data/UtilsTestSheet.xlsx');
            const sheet = workbook.Sheets['Present'];
            const result = Utils.findCellNameByContent(sheet, 'Find Me!');
            expect(result).equals('C4');
        });

        it('should not find data in sheet where missing', () => {
            const workbook = XLSX.readFile('test/data/UtilsTestSheet.xlsx');
            const sheet = workbook.Sheets['Missing'];
            const result = Utils.findCellNameByContent(sheet, 'Find Me!');
            expect(result).equals(null);
        });

    });

});
