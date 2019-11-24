const xlsx = require('xlsx');

/**
 * Information from the services page of the spreadsheet - dates and times of all services with DoD
 */
class ServicesSheet {
    /**
     * Create a ServicesSheet 
     */
    constructor () {
        
    }
    /**
     * Load the services data from spreadsheet
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

module.exports = ServicesSheet;