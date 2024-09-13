export function autocomplete(data, args) {
  return [...data.servers, "--help"];
}

export function fMoney(number) {
  const MoneySuffixList = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n"];
  const Neg = number < 0;
  let absNum = Math.abs(number);
  let idx = 0;
  while (absNum > 1e3 && idx < MoneySuffixList.length) {
    absNum /= 1e3;
    ++idx;
  }
  if (idx < MoneySuffixList.length) {
    return `${Neg ? "-" : " "}\$${absNum.toFixed(3)}${MoneySuffixList[idx]}`;
  }
  return `${Neg ? "-" : " "}\$${absNum.toExponential(3)}`;
}

/** @param {NS} ns */
export function makeServerList(ns) {
  const ServerList = [];
  function recursiveFunc(fromHost = "home") {
    if (!ServerList.includes(fromHost)) {
      ServerList.push(fromHost);
      for (let host of ns.scan(fromHost)) {
        recursiveFunc(host);
      }
    }
  }
  recursiveFunc();
  return ServerList;
}

/** @param {NS} ns */
export async function main(ns) {
  const RED = 31;
  const GREEN = 32;
  const YELLOW = 33;
  const BLUE = 34;
  const TEAL = 36;

  let serv = ns.args[0] ?? ns.getServer().hostname;
  let printUsage = serv.includes("?");
  if (!printUsage) {
    let lcServ = serv.toLocaleLowerCase();
    if (lcServ === "--help" || lcServ === "help" || lcServ === "h" || !makeServerList(ns).includes(serv)) {
      printUsage = true;
    }
  }
  if (printUsage) {
    ns.tprintRaw(`xanalyze Usage: xanalyze SERVER
Example: 
> xanalyze run4theh111z
`);
    ns.exit();
  }


  let player = ns.getPlayer();
  let server = ns.getServer(serv);

  let root_access = "NO";
  let root_access_col = RED;
  let can_run_scripts = "NO";
  let can_run_scripts_col = RED;
  let total_ram = ns.formatRam(server.maxRam);
  let total_ram_col = RED;
  let backdoor_installed = "NO";
  let backdoor_installed_col = RED;
  let hacking_skill = server.requiredHackingSkill;
  let hacking_skill_col = RED;
  let security_level = server.hackDifficulty;
  let security_level_col = RED;
  let chance_to_hack = ns.formulas.hacking.hackChance(server, player);
  let chance_to_hack_col = RED;
  let time_to_hack = ns.formulas.hacking.hackTime(server, player);
  let money_available = server.moneyAvailable;
  let money_available_col = RED;
  let required_open_ports = server.numOpenPortsRequired;
  let required_open_ports_col = RED;
  let open_count = 0;

  let ownedOpeners = 0;
  function checkIfOwned(opener) {
    if (ns.fileExists(opener)) {
      ++ownedOpeners;
      return true;
    }
    return false;
  }

  let ssh_port = "Closed";
  let ssh_port_col = checkIfOwned("BruteSSH.exe") ? YELLOW : RED;
  let ftp_port = "Closed";
  let ftp_port_col = checkIfOwned("FTPCrack.exe") ? YELLOW : RED;
  let smtp_port = "Closed";
  let smtp_port_col = checkIfOwned("relaySMTP.exe") ? YELLOW : RED;
  let http_port = "Closed";
  let http_port_col = checkIfOwned("HTTPWorm.exe") ? YELLOW : RED;
  let sql_port = "Closed";
  let sql_port_col = checkIfOwned("SQLInject.exe") ? YELLOW : RED;

  let canRoot = server.hasAdminRights;
  let canHack = canRoot || ownedOpeners >= server.numOpenPortsRequired;
  if (canRoot) {
    root_access_col = YELLOW;
    backdoor_installed_col = YELLOW;
  }
  if (canHack) {
    can_run_scripts_col = YELLOW;
    required_open_ports_col = YELLOW;
  }

  //ns.tprintf(`\x1b[1;36m• Basic colors`)
  if (server.hasAdminRights) {
    root_access = "YES";
    root_access_col = TEAL;
  }

  if (server.maxRam > 100) {
    total_ram_col = TEAL;
  }
  else if (server.maxRam > 10) {
    total_ram_col = YELLOW;
  }

  if (server.backdoorInstalled) {
    backdoor_installed = "YES";
    backdoor_installed_col = TEAL;
  }

  if (hacking_skill * 2 < player.skills.hacking) {
    hacking_skill_col = TEAL;
  }
  else if (hacking_skill <= player.skills.hacking) {
    hacking_skill_col = YELLOW;
  }

  if (server.hackDifficulty < 2 * server.minDifficulty) {
    security_level_col = TEAL;
  }
  else if (server.hackDifficulty < 10 * server.minDifficulty) {
    security_level_col = YELLOW;
  }

  if (chance_to_hack > 0.8) {
    chance_to_hack_col = TEAL;
  }
  else if (chance_to_hack > 0.5) {
    chance_to_hack_col = YELLOW;
  }

  if (money_available > 1e12) {
    money_available_col = TEAL;
  }
  else if (money_available > 1e9) {
    money_available_col = YELLOW;
  }

  if (server.sshPortOpen) {
    ssh_port = "Open";
    ssh_port_col = TEAL;
    ++open_count;
  }

  if (server.ftpPortOpen) {
    ftp_port = "Open";
    ftp_port_col = TEAL;
    ++open_count;
  }

  if (server.smtpPortOpen) {
    smtp_port = "Open";
    smtp_port_col = TEAL;
    ++open_count;
  }

  if (server.httpPortOpen) {
    http_port = "Open";
    http_port_col = TEAL;
    ++open_count;
  }

  if (server.sqlPortOpen) {
    sql_port = "Open";
    sql_port_col = TEAL;
    ++open_count;
  }

  if (server.hasAdminRights || open_count >= server.numOpenPortsRequired) {
    can_run_scripts = "YES";
    can_run_scripts_col = TEAL;
  }

  ns.tprintRaw(`
${server.hostname}: `);
  ns.tprintRaw(`Organization name: ${server.organizationName} `);
  ns.tprintf(`Root Access: \x1b[${root_access_col}m${root_access}`);
  ns.tprintf(`Can run scripts on this host: \x1b[${can_run_scripts_col}m${can_run_scripts}`);
  ns.tprintf(`RAM: \x1b[${total_ram_col}m${total_ram}`);
  ns.tprintf(`Backdoor: \x1b[${backdoor_installed_col}m${backdoor_installed}`);
  ns.tprintf(`Required hacking skill for hack() and backdoor: \x1b[${hacking_skill_col}m${hacking_skill}`);
  //ns.tprintf(`Server security level: \x1b[${security_level_col}m${security_level.toFixed(3)}`);
  ns.tprintRaw(`Server security level: ${security_level.toFixed(3)}`);
  ns.tprintf(`Chance to hack: \x1b[${chance_to_hack_col}m${(chance_to_hack * 100).toFixed(2)}%%`);
  ns.tprintRaw(`Time to hack: ${(time_to_hack * 0.001).toFixed(3)} seconds`);
  ns.tprintf(`Total money available on server:\x1b[${money_available_col}m${fMoney(money_available)}`);
  ns.tprintf(`Required number of open ports for NUKE: \x1b[${required_open_ports_col}m${required_open_ports}`);
  ns.tprintf(`SSH port: \x1b[${ssh_port_col}m${ssh_port}`);
  ns.tprintf(`FTP port: \x1b[${ftp_port_col}m${ftp_port}`);
  ns.tprintf(`SMTP port: \x1b[${smtp_port_col}m${smtp_port}`);
  ns.tprintf(`HTTP port: \x1b[${http_port_col}m${http_port}`);
  ns.tprintf(`SQL port: \x1b[${sql_port_col}m${sql_port}`);
}
