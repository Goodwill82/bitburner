
/** @param {NS} ns */
function recursionExample(ns) {
  const loopTimes = 10;

  // in general, you might loop through something like this:
  ns.print(`for-loop example - count from 0 to ${loopTimes - 1}:`);
  for (let index = 0; index < loopTimes; ++index) {
    ns.print(`index: ${index}`);
  }

  ns.print(""); // blank line
  ns.print(`recursive-loop example - count from 0 to ${loopTimes - 1}:`);
  // first we make a function that can call itself - most important thing is defining the exit
  function recursiveLoop(loopIndex = 0) {
    // we want to stop the recursion loop when loopIndex >= loopTimes
    if (loopIndex >= loopTimes) {
      return;
    }
    // if we got here since we didn't return from the if check above
    // do the work (in this case, just print the index) 
    ns.print(`loopIndex: ${loopIndex}`);
    // and call this function again with the next index 
    recursiveLoop(loopIndex + 1, loopTimes);
  }
  // no we actually perform the loop - by calling the function to start it off
  recursiveLoop(); // just using the defaults on the first call

  // so what does this look like:
  // recursiveLoop(0) prints "loopIndex: 0" and calls
  //  recursiveLoop(1) prints "loopIndex: 1" and calls
  //   recursiveLoop(2) prints "loopIndex: 2" and calls
  //    recursiveLoop(3) prints "loopIndex: 3" and calls
  //     recursiveLoop(4) prints "loopIndex: 4" and calls
  //      recursiveLoop(5) prints "loopIndex: 5" and calls
  //       recursiveLoop(6) prints "loopIndex: 6" and calls
  //        recursiveLoop(7) prints "loopIndex: 7" and calls
  //         recursiveLoop(8) prints "loopIndex: 8" and calls
  //          recursiveLoop(9) prints "loopIndex: 9" and calls
  //           recursiveLoop(10) loopIndex >= loopTimes, so this returns without doing anything 
  //          recursiveLoop(9) returns
  //         recursiveLoop(8) returns
  //        recursiveLoop(7) returns
  //       recursiveLoop(6) returns
  //      recursiveLoop(5) returns
  //     recursiveLoop(4) returns
  //    recursiveLoop(3) returns
  //   recursiveLoop(2) returns
  //  recursiveLoop(1) returns
  // recursiveLoop(0) returns and the loop is complete

  // seems like a lot of work for no real benefit - but hopefully it's clear that this 
  // method works. why use it when it takes more lines of code and is harder to follow?
  // in this example case, there is no reason aside from simple demonstration. 
  // The nice thing about most programming languages (including JS) is that every time 
  // they call a function, they not only save their spot where they were before they called the 
  // function, but they keep a snapshot of current function variables. 

  // When we called recursiveLoop(), loopIndex = 0. when recursiveLoop(1) 
  // was then called, it had it's own two varaibles, loopIndex = 1. Even though they are in the 
  // same function definition, and they have the same name, loopIndex from the first call is 
  // retained. It is in a different part of memory in the second (and subsequent) call.  
  // You can prove this by switching the order of the print and the recursive call. 
  // The values are retained, but will print in reverse order - I hope it's clear why. 

  // Since the place and variables are kept between function calls, we can look at a better 
  // example with the following function - scanning the network for all servers. 
}

/** @param {NS} ns */
function makeServerList(ns) {
  // Start a list of just the root
  const FullServerList = ["home",];

  // This function does not have to be within makeServerList, but it makes it easier 
  // because then it shares FullServerList defined above so I don't have to pass it. 
  function recursionScan(scanFrom = "home") {
    // the following loop style is another way to go through each element of a list. 
    // It a convenient shorthand, but could also be done with: 
    // let scanList = ns.scan(scanFrom);
    // for (let i = 0; i < scanList; ++i) {
    //   let server = scanList[i]; // or scanList.at(i)
    //   ...
    for (let server of ns.scan(scanFrom)) {
      // if we have seen any servers from this scan before, skip it - this is an exit condition. 
      // note the difference between simply returning from the function - since the structure is 
      // a "tree" stucture, and not a list like the counting example, we need to continue on and 
      // look at the rest of the servers attached. 
      if (FullServerList.includes(server)) {
        continue; // this skips the rest of the loop for this server, and moves on to the next server
      }
      // since we are here, we know server should be added to the list
      FullServerList.push(server);
      // recursion step - we want to run this same scan on this server
      recursionScan(server);
    }
    // another exit condition - when the end of the scan list is reached
  }

  // now run the function - FullServerList just has "home" in it now. 
  recursionScan();
  // that's it! FullServerList is populated after this call 
  // but what happened? It's a bit harder to follow in this case vs the counting case

  // Consider a very simple network:
  // home
  // |- n00dles
  // |- foodnstuff
  // |  -- CSEC
  // -- joesguns

  // ns.scan("home") returns ["n00dles", "foodnstuff", "joesguns"]
  // ns.scan("n00dles") returns ["home",]
  // ns.scan("foodnstuff") returns ["home", "CSEC"]
  // ns.scan("CSEC") returns ["foodnstuff",]
  // ns.scan("joesguns") returns ["home",]

  // so what does this look like:
  // recursionScan("home") server = "n00dles", FullServerList.includes("n00dles") == false, so add it and call
  //  recursionScan("n00dles") server = "home", FullServerList.includes("home") == true, continue -> end of list, return
  // back to loop -------> server = "foodnstuff", FullServerList.includes("foodnstuff") == false, so add it and call
  //  recursionScan("foodnstuff") server = "home", FullServerList.includes("home") == true, continue
  //  back to loop ------> server = "CSEC", FullServerList.includes("CSEC") == true, false, so add it and call
  //   recursionScan("CSEC") server = "foodnstuff", FullServerList.includes("foodnstuff") == true, continue -> end of list, return
  //  back to loop -> end of list, return
  // back to loop -------> server = "joesguns", FullServerList.includes("joesguns") == false, so add it and call
  //  recursionScan("joesguns") server = "home", FullServerList.includes("home") == true, continue -> end of list, return
  // back to loop -> end of list, return

  // this is a pretty crappy example, but I hope it shows how every server will be added to the list so long as the servers 
  // are connected in a tree-like structure with "home" as the root. 

  return FullServerList;
}

/** @param {NS} ns */
export async function main(ns) {
  ns.ui.openTail();
  let testSimple = true;
  if (testSimple) {
    recursionExample(ns);
  }
  else {
    ns.disableLog("scan"); // disabling scan logging so it doesn't clutter the tail window
    ns.print(makeServerList(ns)); // this output should look like an array of strings with server names. 
    // you could hold this array, or loop through it like this:
    //for (let server of makeServerList(ns)) { ... }
  }
}
