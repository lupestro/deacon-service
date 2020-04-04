const Utils = require('./sheet-utils');

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
        const [deacons, alternates, nameIndex, teamIndex] = this.populateData();
        this.validateData(deacons, alternates, nameIndex);
        this.deacons = deacons;
        this.alternates = alternates;
        this.nameIndex = nameIndex;
        this.teamIndex = teamIndex;
    }
    /**
     * Validate that the structure of the data in the spreadsheet is in good enough shape to load.
     */
    validateStructure() {
        let messages = [];
        let fromHeader = Utils.findCellNameByContent(this.sheet, 'From:');
        let untilHeader = Utils.findCellNameByContent(this.sheet, "Until:");
        let teamHeader = Utils.findCellNameByContent(this.sheet, 'Team');
        let familiesHeader = Utils.findCellNameByContent(this.sheet, 'Families');
        if (!fromHeader) {
            messages.push("Roster has invalid structure - \"From:\" not found.");
        }
        if (!untilHeader) {
            messages.push("Roster has invalid structure - \"Until:\" not found.");
        }
        if (!teamHeader) { 
            messages.push("Roster has invalid structure - \"Team\" not found.");
        }
        if (!familiesHeader) {
            messages.push("Roster has invalid structure - \"Families\" not found.")
        }
        let deaconHeader = Utils.offset(teamHeader,1,0);
        if (!this.sheet[deaconHeader] || this.sheet[deaconHeader].v !== 'Deacon') {
            messages.push("Roster has invalid structure - \"Team\" not followed by \"Deacon\".");
        }
        let shortNameHeader = Utils.offset(deaconHeader,1,0);
        if (!this.sheet[shortNameHeader] || this.sheet[shortNameHeader].v  !== 'Short Name') {
            messages.push("Roster has invalid structure - \"Deacon\" not followed by \"Short Name\".");
        }
        let emailHeader = Utils.findCellNameByContent(this.sheet, 'Primary Email');
        if (!emailHeader) {
            messages.push("Roster has invalid structure - \"Primary Email\" not found.");
        }
        let [,y] = Utils.distance(teamHeader, emailHeader); 
        if (y !== 0) {
            messages.push("Roster has invalid structure - \"Primary Email\" not in same row as \"Deacon\"");
        }
        if (messages.length > 0) {
            throw new Error (messages.join('\r\n'));
        }       
    }
    populateData() {
        let fromHeader = Utils.findCellNameByContent(this.sheet, 'From:');
        let untilHeader = Utils.findCellNameByContent(this.sheet, "Until:");
        let teamHeader = Utils.findCellNameByContent(this.sheet, 'Team');
        let familiesHeader = Utils.findCellNameByContent(this.sheet, 'Families');
        let emailHeader = Utils.findCellNameByContent(this.sheet, 'Primary Email');

        this.fromDate = this.sheet[Utils.offset(fromHeader, 1, 0)].w;
        this.untilDate = this.sheet[Utils.offset(untilHeader, 1, 0)].w;

        let families = [];
        for (let famCell = Utils.offset(familiesHeader,0,1); this.sheet[famCell]; famCell = Utils.offset(famCell, 0, 1)) {
            families.push (this.sheet[famCell].v.split(/[,\s]+/));
        }

        let [,familiesDy] = Utils.distance(teamHeader, familiesHeader);
        let [emailDx,] = Utils.distance(teamHeader, emailHeader);

        let deacons = [];
        let alternates = [];
        let teamRange = Utils.offset(teamHeader,0,1) + ":" + Utils.offset(teamHeader,emailDx,familiesDy-1);
        let lastOffset = 1;
        let deaconInProgress = {short_name: "", full_name: "", team: "", email: ""};
        for (const cell of Utils.cellNamesInRange(teamRange)) {
            let [x,y] = Utils.distance(teamHeader, cell);
            if (y !== lastOffset) {
                if (deaconInProgress.team === "" ) {
                    //ignore row - treat as empty
                }
                else if (deaconInProgress.team === "S") {
                    alternates.push(deaconInProgress);
                } else {
                    deacons.push(deaconInProgress);
                }
                deaconInProgress = {short_name: "", full_name: "", team: "", email: ""};
                lastOffset = y;
            }
            let columnName = (x === 0) ? "team" : (x === 1) ? "full_name" : (x === 2) ? "short_name" : (x === emailDx) ? "email" : "";
            if (columnName !== '' && this.sheet[cell]) {
                deaconInProgress[columnName] = this.sheet[cell].v; 
            }
        }

        // Build the deacon name and team indexes
        let nameIndex = {};
        let teamIndex = {};
        deacons.forEach((deacon,index) => {
            if (!Object.hasOwnProperty.call(nameIndex, deacon.short_name)) {
                nameIndex[deacon.short_name] = [];
            }
            nameIndex[deacon.short_name].push(index);
            if (!Object.hasOwnProperty.call(teamIndex, deacon.team)) {
                teamIndex[deacon.team] = [];
            }
            teamIndex[deacon.team].push(index);
        });
    
        alternates.forEach((alternate,index) => {
            if (!Object.hasOwnProperty.call(nameIndex, alternate.short_name)) {
                nameIndex[alternate.short_name] = [];
            }
            nameIndex[alternate.short_name].push(-(index+1));
        });

        families.forEach((family,familyIndex) => {
            family.forEach((member)=>{
                if (Object.hasOwnProperty.call(nameIndex, member)) {
                    const idx = nameIndex[member][0]
                    if (idx >= 0) {
                        deacons[idx].family = familyIndex;
                    } else {
                        alternates[(-idx) - 1].family = familyIndex;
                    }
                }
            })
        });        
        return [deacons, alternates, nameIndex, teamIndex];
    }
    validateData(deacons, alternates, nameIndex) {
        let messages = [];

        // Validate that there are no duplicate short names across the deacons and alternates.
        for (const key of Object.keys(nameIndex)) {
            if (Object.hasOwnProperty.call(nameIndex, key)) {
                if (nameIndex[key].length > 1) {
                    let fullNames = []
                    for (const index of nameIndex[key]) {
                        if (index < 0) {
                            fullNames.push(alternates[-index-1].full_name);
                        } else {
                            fullNames.push(deacons[index].full_name);
                        }
                    }
                    messages.push(`Roster sheet contains duplicate short name ${key} on ${fullNames.join(',')}.`);
                }
            }
        }

        // Validate each deacon has a numeric team and each alternate doesn't.
        for (const deacon of deacons) {
            if (!/^\d+$/.test(deacon.team) && deacon.team !== "") {
                messages.push (`Roster sheet contains deacon ${deacon.short_name} with non-numeric team.`);
            }
        }
        for (const alternate of alternates) {
            if (alternate.team !== "" && alternate.team !== "S") {
                messages.push (`Roster sheet contains alternate ${alternate.short_name} with a team other than "S"`);
            }
        }
        if (messages.length > 0) {
            throw new Error(messages.join("\r\n"));
        }
    }
}
module.exports = RosterSheet;