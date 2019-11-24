const xlsx = require('xlsx');

/**
 * Information from the "Team Schedule" page of the spreadsheet - team assignments for communion and baptisms 
 * for each month
 */
class TeamScheduleSheet {
    /**
     * Create a TeamScheduleSheet 
     */
    constructor () {
        
    }
    /**
     * Load the team schedule data from spreadsheet
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

module.exports = TeamScheduleSheet;