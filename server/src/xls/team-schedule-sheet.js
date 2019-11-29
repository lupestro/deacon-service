const Utils = require('./sheet-utils');

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
        const schedule = this.populateData();
        this.validateData(schedule);
        this.schedule = schedule;
    }
    /**
     * Validate that the structure of the data in the spreadsheet is in good enough shape to load.
     */
    validateStructure() {
        let monthHeader = Utils.findCellNameByContent(this.sheet, 'Month');
        let yearHeader = Utils.findCellNameByContent(this.sheet, 'Year');
        let domsHeader = Utils.findCellNameByContent(this.sheet, 'DOMs');
        let communionHeader = Utils.findCellNameByContent(this.sheet, 'Communion');
        let baptismsHeader = Utils.findCellNameByContent(this.sheet, 'Baptisms');
        if (!monthHeader) {
            throw new Error("Team schedule has invalid structure - \"Month\" not found.");
        }
        if (!yearHeader) {
            throw new Error("Team schedule has invalid structure - \"Year\" not found.");
        }
        if (!domsHeader) { 
            throw new Error("Team schedule sheet has invalid structure - \"DOMs\" not found.");
        }
        if (!communionHeader) {
            throw new Error("Team schedule sheet has invalid structure - \"Communion\" not found.");
        }
        if (!baptismsHeader) {
            throw new Error("Team schedule sheet has invalid structure - \"Baptisms\" not found.");
        }
        let [yearX, yearY] = Utils.distance(monthHeader, yearHeader);
        let [domsX, domsY] = Utils.distance(monthHeader, domsHeader);
        let [commX, commY] = Utils.distance(monthHeader, communionHeader);
        let [baptX, baptY] = Utils.distance(monthHeader, baptismsHeader);
        if ((yearY !== 0) || (domsY !== 0) || (commY !== 0) || (baptY !== 0)) {
            throw new Error("Team schedule sheet has invalid structure - table headers aren't on single row.");
        }
        if ((yearX !== 1) || domsX !==2 || commX !== 3 || baptX - commX !== 5) {
            throw new Error("Team schedule sheet has invalid structure - table headings aren't in expected order");
        }
    }
    populateData() {
        let monthHeader = Utils.findCellNameByContent(this.sheet, 'Month');
        let yearHeader = Utils.findCellNameByContent(this.sheet, 'Year');
        let domsHeader = Utils.findCellNameByContent(this.sheet, 'DOMs');
        let communionHeader = Utils.findCellNameByContent(this.sheet, 'Communion');
        let baptismsHeader = Utils.findCellNameByContent(this.sheet, 'Baptisms');
        let [yearX,] = Utils.distance(monthHeader, yearHeader);
        let [domsX,] = Utils.distance(monthHeader, domsHeader);
        let [commX,] = Utils.distance(monthHeader, communionHeader);
        let [baptX,] = Utils.distance(monthHeader, baptismsHeader);
        let pageRange = this.sheet['!ref'].split(':');
        let [,height] = Utils.distance(monthHeader, pageRange[1]);
        let tableRange = Utils.offset(monthHeader,0,2) + ":" + Utils.offset(baptismsHeader, 0, height);
        let schedule = [];
        let lastOffset = 2;
        let monthInProgress = {month: "", year: "", doms: "", downstairs: [], upstairs: [], baptisms: ""};
        for (const cell of Utils.cellNamesInRange(tableRange)) {
            let [x,y] = Utils.distance(monthHeader, cell);
            if (y !== lastOffset) {
                schedule.push(monthInProgress);
                monthInProgress = {month: "", year: "", doms: "", downstairs: [], upstairs: [], baptisms: ""};
                lastOffset = y;
            }
            let columnName = (x === 0) ? "month" : (x === yearX) ? "year" : (x === domsX) ? "doms" : (x === baptX) ? "baptisms" : "";
            if (this.sheet[cell]) {
                if (columnName !== '') {
                    monthInProgress[columnName] = this.sheet[cell].v; 
                } else if (x >= commX && x < baptX) {
                    if ((x - commX) < 3) { // first three columns
                        monthInProgress.downstairs.push(this.sheet[cell].v);
                    } else {
                        monthInProgress.upstairs.push(this.sheet[cell].v);
                    }
                }
            }
        }
        return schedule;
    }
    validateData(schedule) {
        const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        for (const row of schedule) {
            if (!MONTHS.includes(row.month)) {
                throw new Error(`Team schedule sheet has invalid month ${row.month}. Should be full English month name.`);
            }
            if (!/^\d{4}$/.test(row.year) ) {
                throw new Error(`Team schedule sheet has invalid year ${row.year} for ${row.month}. Should be four digit year.`);
            }
            if (parseInt(row.year) < 2000 || parseInt(row.year) > 2050) {
                throw new Error(`Team schedule sheet has year that isn't between 2000 and 2050.`);
            }
        }
    }

}

module.exports = TeamScheduleSheet;