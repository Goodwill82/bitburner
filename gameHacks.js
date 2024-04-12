
/**
 * runTerminalCommand: Runs the given string in the terminal window. Note that the terminal must be the current window. 
 *
 * @param {string} command - A string with the terminal command(s) to run.
 **/
export function runTerminalCommand(command) {
	let terminalInput = eval("document").getElementById("terminal-input");
	let terminalEventHandlerKey = Object.keys(terminalInput)[1];
	terminalInput.value = command;
	terminalInput[terminalEventHandlerKey].onChange({ target: terminalInput });
	setTimeout(function (event) {
		terminalInput.focus();
		terminalInput[terminalEventHandlerKey].onKeyDown({ key: 'Enter', preventDefault: () => 0 });
	}, 0);
};

export const TabIcons = {
	"Hacking": "ComputerIcon",
	"Terminal": "LastPageIcon",
	"Script Editor": "CreateIcon",
	"Active Scripts": "StorageIcon",
	"Create Program": "BugReportIcon",
	"Staneks Gift": "DeveloperBoardIcon",
	"Character": "AccountBoxIcon",
	"Stats": "EqualizerIcon",
	"Factions": "ContactsIcon",
	"Augmentation": "DoubleArrowIcon",
	"Hacknet": "AccountTreeIcon",
	"Sleeve": "PeopleAltIcon",
	"World": "PublicIcon",
	"City": "LocationCityIcon",
	"Travel": "AirplanemodeActiveIcon",
	"Job": "WorkIcon",
	"Stock Market": "TrendingUpIcon",
	"Bladeburner": "FormatBoldIcon",
	"Gang": "SportsMmaIcon",
	"Corporation": "BusinessIcon",
	"Help": "LiveHelpIcon",
	"Milestones": "CheckIcon",
	"Documentation": "HelpIcon",
	"Achievements": "EmojiEventsIcon",
	"Options": "SettingsIcon"
}
export const TabGroups = [
	{ group: "Hacking", tabs: ["Terminal", "Script Editor", "Active Scripts", "Create Program", "Staneks Gift"] },
	{ group: "Character", tabs: ["Stats", "Factions", "Augmentation", "Hacknet", "Sleeve"] },
	{ group: "World", tabs: ["City", "Travel", "Job", "Stock Market", "Bladeburner", "Gang", "Corporation"] },
	{ group: "Help", tabs: ["Milestones", "Documentation", "Achievements", "Options"] },
]

export function setTab(tabName) {
	//  get group (and check if tabName is valid)
	let groupName = "";
	for (let tabGroup of TabGroups) {
		if (tabGroup.tabs.includes(tabName)) {
			groupName = tabGroup.group;
			break;
		}
	}
	if (groupName.length > 0) {
		let doc = eval("document");
		// if the sidebar is collapsed, we can just click on the 'aria-label' which is the tab name, else we need to click by icon name
		let collapsed = doc.querySelectorAll(`[aria-label='${groupName}']`).length > 0;
		if (collapsed) {
			// unable to click on group icon - groups must be expanded to work
			// // check if the group is expanded - if not, expand it by clicking the group name
			// if (doc.querySelectorAll(`[aria-label='${tabName}']`).length === 0) {
			// 	if (doc.querySelectorAll(`[aria-label='${groupName}']`).length > 0) {
			// 		doc.querySelectorAll(`[aria-label='${groupName}']`)[0].nextSibling.click();
			// 	}
			// }
			// finally, click the tab (still check if it exists - might not be available yet)
			if (doc.querySelectorAll(`[aria-label='${tabName}']`).length > 0) {
				doc.querySelectorAll(`[aria-label='${tabName}']`)[0].nextSibling.click();
				return true; // found tab, and clicked it
			}
		}
		else {
			let tabIcon = TabIcons[tabName];
			// unable to click on group icon - groups must be expanded to work
			// let groupIcon = TabIcons[groupName];
			// // check if the group is expanded - if not, expand it by clicking the group icon
			// if (doc.querySelectorAll(`[data-testid='${tabIcon}']`).length === 0) {
			// 	if (doc.querySelectorAll(`[data-testid='${groupIcon}']`).length > 0) {
			// 		doc.querySelectorAll(`[data-testid='${groupIcon}']`)[0].nextSibling.click();
			// 	}
			// }
			// finally, click the tab (still check if it exists - might not be available yet)
			if (doc.querySelectorAll(`[data-testid='${tabIcon}']`).length > 0) {
				doc.querySelectorAll(`[data-testid='${tabIcon}']`)[0].nextSibling.click();
				return true; // found tab, and clicked it
			}
		}
	}
	return false; // could not find the tab
}
