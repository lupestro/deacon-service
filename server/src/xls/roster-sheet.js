const xlsx = require('xlsx');

/**
 * Information from the roster page of the spreadsheet
 */
class RosterSheet {
    /**
     * Create a RosterSheet 
     */
    constructor () {
        
    }
    /**
     * Load the roster data from spreadsheet
     * @param {Sheet} sheet 
     */
    load(sheet) {
        this.sheet = sheet;
        this.validateStructure();
    }
    /**
     * Validate that the structure of the data in the spreadsheet is in good enough shape to load.
     */
    validateStructure() {

    }
}
module.exports = RosterSheet;