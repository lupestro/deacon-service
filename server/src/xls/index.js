const XLSX = require('xlsx');
const TeamScheduleSheet = require('./team-schedule-sheet');
const RosterSheet = require('./roster-sheet');
const ServicesSheet = require('./services-sheet');

/**
 * Manage loading and validation of the Deacons spreadsheet
 */
class Workbook {
    constructor (teamSchedule, roster, services) {
        this.workbook = null;
        this.teamScheduleSheet = teamSchedule || new TeamScheduleSheet();
        this.rosterSheet = roster || new RosterSheet();
        this.servicesSheet = services || new ServicesSheet();
    }
    /**
     * Read a spreadsheet from the provided path and ensure it has all its pieces intact
     * @param {string} path 
     */
    loadFromFile(path) {
        this.workbook = XLSX.readFile(path);
        if (!this.validateStructure()) {
            throw new Error("Workbook has invalid structure - should have sheets Team Schedule, Roster, and Services");
        }
        let messages = [];
        try {
            this.teamScheduleSheet.load(this.workbook.Sheets['teamSchedule']);
        } catch (e) {
            messages.push (e.message);
        }
        try {
            this.rosterSheet.load(this.workbook.Sheets['Roster']);
        } catch (e) {
            messages.push (e.message);
        }
        try {
            this.servicesSheet.load(this.workbook.Sheets['Services']);
        } catch (e) {
            messages.push (e.message);
        }
        if (messages.length > 0) {
            throw new Error(messages.join('\r\n'));
        }
    }
    /**
     * Validate the overall structure of the spreadsheet. 
     * Once we're sure we have enough overall structure to proceed, each of the sheets will be asked to verify its own structure.
     */
    validateStructure () {
        return this.workbook.SheetNames.includes('Team Schedule') &&
            this.workbook.SheetNames.includes('Roster') &&
            this.workbook.SheetNames.includes('Services');
    }
    /**
     * Combine the team schedule, team membership from the roster, and services data to build a members-oriented schedule, 
     * of similar form to the occasions list, carrying all information necessary to add occasions, roles, and attendences to the databse.
     */
    buildMemberSchedule() {

    }
    /**
     * Get a list of members, of similar form to the participants list, carrying all information necessary to add members to the database.
     */
    getMembers() {

    }
}
module.exports = Workbook;