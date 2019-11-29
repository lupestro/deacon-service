const Utils = require('./sheet-utils');

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
        const services = this.populateData();
        this.validateData(services);
        this.services = services;
    }
    /**
     * Validate that the structure of the data in the spreadsheet is in good enough shape to load.
     */
    validateStructure() {
        let dateHeader = Utils.findCellNameByContent(this.sheet, 'Date');
        let typeHeader = Utils.findCellNameByContent(this.sheet, 'Type');
        let earlyHeader = Utils.findCellNameByContent(this.sheet, 'Early');
        let primaryHeader = Utils.findCellNameByContent(this.sheet, 'Primary');
        let dodHeader = Utils.findCellNameByContent(this.sheet, 'DoD');
        if (!dateHeader) {
            throw new Error("Services sheet has invalid structure - \"Date\" not found.");
        }
        if (!typeHeader) {
            throw new Error("Services sheet has invalid structure - \"Type\" not found.");
        }
        if (!earlyHeader) { 
            throw new Error("Services sheet has invalid structure - \"Early\" not found.");
        }
        if (!primaryHeader) {
            throw new Error("Services sheet has invalid structure - \"Primary\" not found.");
        }
        if (!dodHeader) {
            throw new Error("Services sheet has invalid structure - \"DoD\" not found.");
        }
        let [, typeY] = Utils.distance(dateHeader, typeHeader);
        let [, earlY] = Utils.distance(dateHeader, earlyHeader);
        let [, primY] = Utils.distance(dateHeader, primaryHeader);
        let [, dodY]  = Utils.distance(dateHeader, dodHeader);
        if ((typeY !== 0) || (earlY !== 0) || (primY !== 0) || (dodY !== 0)) {
            throw new Error("Services sheet has invalid structure - table headers aren't on single row.");
        }
    }
    populateData() {
        let dateHeader = Utils.findCellNameByContent(this.sheet, 'Date');
        let typeHeader = Utils.findCellNameByContent(this.sheet, 'Type');
        let earlyHeader = Utils.findCellNameByContent(this.sheet, 'Early');
        let primaryHeader = Utils.findCellNameByContent(this.sheet, 'Primary');
        let dodHeader = Utils.findCellNameByContent(this.sheet, 'DoD');
        let [typeX,] = Utils.distance(dateHeader, typeHeader);
        let [earlX,] = Utils.distance(dateHeader, earlyHeader);
        let [primX,] = Utils.distance(dateHeader, primaryHeader);
        let [dodX,]  = Utils.distance(dateHeader, dodHeader);
        let maxX = Math.max(typeX, earlX, primX, dodX);
        let pageRange = this.sheet['!ref'].split(':');
        let [,height] = Utils.distance(dateHeader, pageRange[1]);
        let tableRange = Utils.offset(dateHeader,0,1) + ":" + Utils.offset(dateHeader, maxX, height);
        let services = [];
        let lastOffset = 1;
        let serviceInProgress = {date: "", type: "", early: "", primary: "", dod: ""};
        for (const cell of Utils.cellNamesInRange(tableRange)) {
            let [x,y] = Utils.distance(dateHeader, cell);
            if (y !== lastOffset) {
                services.push(serviceInProgress);
                serviceInProgress = {date: "", type: "", early: "", primary: "", dod: ""};
                lastOffset = y;
            }
            let columnName = (x === 0) ? "date" : (x === typeX) ? "type" : 
                (x === earlX) ? "early" : (x === primX) ? "primary" : (x === dodX) ? "dod" : "";
            if (this.sheet[cell] && columnName !== "") {
                serviceInProgress[columnName] = this.sheet[cell].w; 
            }
        }
        return services;
    }
    validateData(services) {
        for (const row of services) {
            if (!/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(row.date)) {
                throw new Error(`Services sheet has invalid date ${row.date}. Format should be mm/dd/yy or mm/dd/yyyy`);
            }
            if (!["","Communion", "Baptism"].includes(row.type)) {
                throw new Error(`Services sheet has invalid type on date ${row.date}. Format should be hh:mm`);
            }
            if (!/^\d+:\d+$/.test(row.primary)) {
                throw new Error(`Services sheet has invalid primary time on date ${row.date}. . Format should be hh:mm`);
            }
            if (row.early !== "" && !/^\d+:\d+$/.test(row.early)) {
                throw new Error(`Services sheet has invalid early time on date ${row.date} .`);
            }
        }

    }
}

module.exports = ServicesSheet;