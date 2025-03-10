/// This script is just printed dialog

/** @param {NS} ns */
export async function main(ns) {
  let outStr = `
When a new player starts the game and after figuring out some of the mechanics, they may 
start connecting to other servers to see what is around. For example, let's say you've 
read about a server called "CSEC". You decide look for it from the terminal. 
You remember the "scan-analyze" command? 
(NOTE: for brevity, I didn't show all connections. Also, server connections and stats 
are mostly randomized so these may not reflect the server stats in your game.): 

> scan-analyze 
┗ home
  ┃   Root Access: YES, Required hacking skill: 1
  ┃   Number of open ports required to NUKE: 5
  ┃   RAM: 128.0GB
  ┣ n00dles
  ┃     Root Access: YES, Required hacking skill: 1
  ┃     Number of open ports required to NUKE: 0
  ┃     RAM: 4.00GB
  ┣ foodnstuff
  ┃     Root Access: YES, Required hacking skill: 1
  ┃     Number of open ports required to NUKE: 0
  ┃     RAM: 16.00GB
  ┗ joesguns
        Root Access: YES, Required hacking skill: 10
        Number of open ports required to NUKE: 0
        RAM: 16.00GB

Well, it's not there. But, you remember that you can call "scan-analyze" with a 
depth (right? if not, run "help scan-analyze" from the terminal to learn more):

> scan-analyze 2
┗ home
  ┃   Root Access: YES, Required hacking skill: 1
  ┃   Number of open ports required to NUKE: 5
  ┃   RAM: 128.0GB
  ┣ n00dles
  ┃     Root Access: YES, Required hacking skill: 1
  ┃     Number of open ports required to NUKE: 0
  ┃     RAM: 4.00GB
  ┣ foodnstuff
  ┃ ┃   Root Access: YES, Required hacking skill: 1
  ┃ ┃   Number of open ports required to NUKE: 0
  ┃ ┃   RAM: 16.00GB
  ┃ ┗ nectar-net
  ┃       Root Access: YES, Required hacking skill: 20
  ┃       Number of open ports required to NUKE: 0
  ┃       RAM: 16.00GB
  ┣ joesguns
    ┃   Root Access: YES, Required hacking skill: 10
    ┃   Number of open ports required to NUKE: 0
    ┃   RAM: 16.00GB
    ┗ CSEC
          Root Access: NO, Required hacking skill: 52
          Number of open ports required to NUKE: 1
          RAM: 8.00GB

There's CSEC! So now we to connect to it - but it's not that direct:

> connect joesguns 
Connected to joesguns
> connect CSEC 
Connected to CSEC

Not too bad, and if you created or bought "AutoLink.exe", it's even easier. And, you can create/buy 
higher levels of scan-analyze depth. But then you still have to scroll through a large network tree 
to find your target. 

Ultimately, you want to quickly connect to any server from your "home" server. It shouldn't matter 
how many servers away it is. 

This is a prime candidate for automation - if you can break it down such that the computer can do it, 
the computer will find your answer much faster than you can. To break it down, we need to understand 
how this network is stuctured. If you look back at the results of "scan-analyze" (especially if ran 
with a larger depth number), as the scan progresses, the servers branch out, like a tree or root 
system. Another thing to notice is that any given server has at least one connection. 

Check out the next topic for more. 
`;
  ns.tprintRaw(outStr);
}
