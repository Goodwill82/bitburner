
// The next comment block describes the function following it

/**
 * getAllServers finds all the servers that are available using the ns.scan function. It uses recursion to spread across the whole network. 
 * 
 * @param {NS} ns - The Netscript namespace holding the game's 'ns' functions. It is needed for the ns.scan function. 
 * @return {string[]} An array of strings which are the names of all the servers found on the network. 
 */
export function getAllServers(ns) {
  const AllServers = []; // start of with an empty list

  // an easy way to recursively search the network is by using an inner function that can call itself in some cases
  function recursiveScan(hostname = "home") {
    // we need to make sure that hostname is not already in the list
    // (this might not make sense reading through the first time, but hopefully it will after reading through)
    if (!AllServers.includes(hostname)) {
      AllServers.push(hostname); // this server wasn't in the list, but it is now
      // now the recursion step: scan this server for its connections...
      for (let connectedHost of ns.scan(hostname)) {
        recursiveScan(connectedHost);// ... and call this function on each connected host
      }
    }
  }

  // then call the function. Notice that the default hostname is "home", so we don't need to supply the name the first time
  recursiveScan(); // once this function is complete, AllServers is populated with server names

  return AllServers;

  // If this function doesn't make sense, that's okay. Recursion is not an easy topic to grasp at first. 
  // It's often helpful to think of a few simple cases: 
  // Case one: pretend that the network consists of just the "home" server, and call getAllServers(ns). 
  //      What happens? recursiveScan() is called with hostname == "home", and AllServers is an empty list. 
  //        Then ns.scan(hostname) is called. Since there are no connected servers in this theoretic case, 
  //        the loop and then the function exit. AllServer is a list with one string, "home", in it. 
  // Case two: pretend that the network is represented like this: 
  //                 "home"
  //                  ----- "n00dles"
  //                  ----- "foodnstuff"
  //                         ----- "CSEC"
  //                  ----- "iron-gym"
  ///     Call getAllServers(ns), and what happens?
  //        Again, recursiveScan() is called with hostname == "home", and AllServers is an empty list. 
  //          Then ns.scan(hostname) is called. There are connected servers so we look at the  
  //          connectedHost == "n00dles", recursiveScan(connectedHost). Note that this is a seperate call, 
  //          so hostname in the second call is "n00dles". 
  //            In the second call, AllServers does not have "n00dles" in it, so it gets added. 
  //            Then ns.scan("n00dles") will return 1 connection for "home". A third call is next. 
  //              recursiveScan("home") call will check AllServers, which now has "home"
  //              in it, so this function ends call and goes back to the seconds call. 
  //            Next connected server is "foodnstuff". recursiveScan(connectedHost) adds "foodnstuff" 
  //            to AllServers, and then ns.scan("foodnstuff") will return 2 connections for "CSEC" and "home". 
  //              recursiveScan("CSEC") call will add "CSEC" to AllServers, and ns.scan("CSEC") returns "foodnstuff". 
  //                recursiveScan("foodnstuff") will reutrn since "foodnstuff" is in the list
  //              recursiveScan("home"), again, return returns almost immediately
  //            "iron-gym" is handled next. recursiveScan("iron-gym") call will add "iron-gym" to list. 
  //              recursiveScan("home"), again, return returns almost immediately
  // If you can understand how to handle these smaller cases, it should be pretty clear that you can add 
  // more and more connections and still come out with a full server list. 
}

export function naivePathSearch() {
  return `Consider this small network: 

  home
  ┣ n00dles
  ┣ foodnstuff
  ┃  ┣ CSEC
  ┃  ┃  ┗ phantasy
  ┃  ┗ max-hardware
  ┗ iron-gym
     ┗ joesguns

If we want to go from home to max-hardware, it's clear see the correct path is "home -> foodnstuff -> max-hardware". 
But how to tell the computer to find the path? Let's just see if we can write a function for this. Starting with 
what server we are starting at, and the server we want to get to. 

    function findServer(target, source = "home") {
        let path = source; // start at the source - we will make a string that is the path
        let connections = ns.scan(source); // we know we need to get some connections, but we theoretically don't know how big this network is
        for (let connection of connections) {
          // check connections for the target
          if (connection == target) {
            path += " -> " + connection;
            return path; // no need to keep looping
          }
          // not everything is just 1 connection away, we need to loop in a loop
          let connection2 = ns.scan(connection);
          for (let connection2 of connections2) {
            // I feel like this function is breaking down, we will need some unknown number of subloops within subloops!
            //
            // REGROUP!
            //
          }
        }
        return path;
    }

As is typical, I jumped into coding and discovered that something wasn't working out as easily as I thought. 
But don't throw this function away! There are a lot of good pieces there that we will use. If nothing else, 
there is a skeleton of the function we want, with specified input and outputs. 

But what went wrong? Typically when I get to this point, I've learned that it's often because I am missing  
information. In this case, I know exactly what it is (I've been here before). When I causually introduced the 
small network, I did so with a diagram: 

  home
  ┣ n00dles
  ┣ foodnstuff
  ┃  ┣ CSEC
  ┃  ┃  ┗ phantasy
  ┃  ┗ max-hardware
  ┗ iron-gym
     ┗ joesguns

The reason it looks more simple that we might think is that this diagram implies a structure. That structure 
is, itself, a huge piece of information! We can use it, and we should. 
`;
}

export function introToRecursion() {
  return `Recursion is a way of looping through connected data. Just like other loops, it is possible to 
program it in such a way that it can never exit. Similar care must be taken to prevent this. 

A common use of the "while" loop, appears to loop forever: 

    while (true) {
        // do something
    }

The loop only terminates if there is a "break" in the loop, e.g.

    while (true) {
        total = getLatestTotal();
        if (total >= maxTotal) {
            break;
        }
    }

(Of course, you can break out in other ways: using a return, calling ns.exit(), killing the program from 
the terminal or another script, etc.)

There is another way we could do this: 

    function loopUntil() {
        if (getLatestTotal() >= maxTotal) {
            return;
        }
        loopUntil();
    }
    loopUntil();

If this looks weird, that's okay. Follow the code along: we defined the function to call itself until some 
condition is met. Then, we call the function. 
In theory, this is perfectly acceptable. It does just what the while loop does - it calls getLatestTotal() 
until the return gets to some threshold, and then stops. 
In reality, you may run into some issues: When the computer calls a function, there is some overhead in doing 
so. It has to save where it was in the program, go to another part of the program, initialize variables in 
the new function... Let's say the maxTotal threshold gets met after 3 calls to getLatestTotal(). Here's what 
the program would do: 

    loopUntil() // 1st call
    | --> loopUntil() // 2nd call
    |     | --> loopUntil() // 3rd call
    |     |     // 3rd call ends
    |     // 2nd call ends
    // 1st call ends

What if it takes 10 calls? 1000? (Script interpreters may be able to optimize this away in some cases.) 

That is the essence of a recursive function. So what good is this? It's more work/time for the computer 
to take, and it looks pretty confusing! 

In some cases, the extra overhead for the computer is well worth it to make a task much easier to program. 
As it turns out, "traversing" through a network, or other things that can be represented as a kind of tree 
that branches out at seemingly random places, is one of these cases. 
`;
}

export function introToTreeStructure() {
  return `Back to that simplified network: 

  home
  ┣ n00dles
  ┣ foodnstuff
  ┃  ┣ CSEC
  ┃  ┃  ┗ phantasy
  ┃  ┗ max-hardware
  ┗ iron-gym
     ┗ joesguns

How can we represent the information that the network structure gives us? JavaScript give us tools to reprsent 
"things" with characterists and/or properties - a class (trivial example follows): 

    class Something {
      constructor(name = "Bob") {
        this.name = name;
        this.spoke = false;
      }
      sayHi() {
        print("Hi, I'm " + this.name);
        this.spoke = true;
      }
    }

    let aThing = new Something(); // aThing is now a Something object. aThing.name == "Bob" and aThing.spoke == false
    let bThing = new Something("Bob"); // bThing is another Something object. bThing !== aThing, even thought their name and spoke properties are the same
    bThing.name = "Jack"; // renamed
    aThing.sayHi(); // prints "Hi, I'm Bob", and sets aThing.spoke == true
    if (!bThing.spoke) {
      bThing.sayHi(); // since bThing.spoke == false above, this gets called and "Hi, I'm Jack" is printed. 
    }

So if we have any given server, we know it has at least 1 connection. When starting at a particular server, like "home", 
we call that a "root". It's useful to track a "parent/child" relationship between the servers, where a parent server is 
a connected server that is closer to the root server, or is the root server. The root server itself has no parent server. 
A server object for this purpose then has: a name, a "parent", and it's "children", which are all the connections that 
aren't the parent. 

The home object might be represted as: 

  {
    name: "home", parent: "", children: [
      { name: "n00dles", parent: "home", children: [] }, 
      { name: "foodnstuff", parent: "home", children: [
        { name: "CSEC", parent: "iron-gym", children: [
          { name: "phantasy", parent: "CSEC", children: [] }, 
        ] }, 
        { name: "max-hardware", parent: "iron-gym", children: [] }, 
      ] }, 
      { name: "iron-gym", parent: "home", children: [
        { name: "n00dles", parent: "iron-gym", children: [] }, 
      ] }, 
    ] }
  }

Indeed, this seems way more complex than the above network diagram, but this is the hidden information that is so 
easily glossed over. This tree needs to be created dynamically in the program, and not just typed out like above. 

Again, this is an ideal use-case for Recursion. First let's make our server object (traditionally called a "Node"): 

  class Node {
    constructor(value) {
      this.value = value;
      this.parent = null;
      this.children = [];
    }
    addChild(child) {
      child.parent = this;
      this.children.push(child);
    }
  }

  let visited = ["home"]; // there are several ways to avoid backtracking - this is one
  let rootNode = new Node("home");

  // now the recursive function
  function buildNode(node = rootNode) {
    // check connections for new servers to explore
    for (let connection of ns.scan(node.value)) {
      // skip it if we've been here before
      if (visited.includes(connection)) {
        continue;
      }
      visited.push(connection); // else, add it to the list 
      let childNode = new Node(connection);
      node.addChild(childNode); // and connect the parent node
      buildNode(childNode); // here is the recursion, explore down this path
    }
  }

  buildNode(); // call it on the rootNode

Let's try it on the simple network: 

  home
  ┣ n00dles
  ┣ foodnstuff
  ┃  ┣ CSEC
  ┃  ┃  ┗ phantasy
  ┃  ┗ max-hardware
  ┗ iron-gym
     ┗ joesguns

Seeing it in action makes it much easier to understand. Let's track a few things as we progress through the 
buildNode() function. Each indentation is a nested recursion function call: 

buildNode() // rootNode: { value: "home", children: [] }
  Attach n00dles
  buildNode(n00dles) // rootNode: { value: "home", children: ["n00dles",] }
    // The only connection is "home" which is in the visited list - END
  Attach foodnstuff
  buildNode(foodnstuff) // rootNode: { value: "home", children: ["n00dles", "foodnstuff"] }
    Attach CSEC
    buildNode(CSEC) // rootNode: { value: "home", children: ["n00dles", "foodnstuff"] }, foodnstuffNode: { value: "foodnstuff", children: ["CSEC",] }
      Attach phantasy
      buildNode(phantasy)
        // The only connection is "CSEC" which is in the visited list - END
    Attach max-hardware
    buildNode(max-hardware) // rootNode: { value: "home", children: ["n00dles", "foodnstuff"] }, foodnstuffNode: { value: "foodnstuff", children: ["CSEC", "max-hardware"] }
      // The only connection is "foodnstuff" which is in the visited list - END
    // The last connection is "home" which is in the visited list - END
  Attach iron-gym
  buildNode(iron-gym) // rootNode: { value: "home", children: ["n00dles", "foodnstuff", "iron-gym"] }
    Attach joesguns
    buildNode(joesguns)
      // The only connection is "iron-gym" which is in the visited list - END
    // The last connection is "home" which is in the visited list - END

This is a lot of work, and maybe it's still not clear exactly why we need any of this. However, with this prep work 
that we've done, the payoff is coming. 
`;
}

export function recursivePathSearch() {
  return `We are finally ready to apply the tools from above. Let's fix the function from naivePathSearch(): 

    function findServer(target, source = "home") {
        let path = source; // start at the source - we will make a string that is the path
        // TODO: find the path
        return path;
    }

As we've learned, we need to convert the network into something the computer can use. Fortunately, we've done this 
with the buildNode(). It was made for a simplified network, but the rules to the network in the game are the same, 
and so it will work without changing anything!

We have a rootNode object which is the whole network starting at home. If you've look around the network, you may 
have seen there is a server called "the-hub". Starting at rootNode, we just need to find our target node. Let's 
add a function to the Node class to help with this: 

  find(matchValue) {
    if (this.value === matchValue) {
      return this;
    }
    for (let child of this.children) {
      let node = child.find(matchValue);
      if (node !== null) {
        return node;
      }
    }
    return null;
  }

Try to follow it through in your mind for a little bit so the recursion makes sense. 
We have rootNode, populated with our buildNode() function. Call the new find function on it. 

  let targetNode = rootNode.find("the-hub");
  if (targetNode !== null) {
    // target found
  }

And, finally, we wrap this all up into one neat function and a class definition: 

  class Node {
    constructor(value) {
      this.value = value;
      this.parent = null;
      this.children = [];
    }
    addChild(child) {
      child.parent = this;
      this.children.push(child);
    }
  }
  find(matchValue) {
    if (this.value === matchValue) {
      return this;
    }
    for (let child of this.children) {
      let node = child.find(matchValue);
      if (node !== null) {
        return node;
      }
    }
    return null;
  }

  function findServer(target, source = "home") {
    let visited = [source];
    let rootNode = new Node(source);
    function buildNode(node = rootNode) {
      for (let connection of ns.scan(node.value)) {
        if (visited.includes(connection)) {
          continue;
        }
        visited.push(connection);
        let childNode = new Node(connection);
        node.addChild(childNode);
        buildNode(childNode);
      }
    }
    buildNode(); // build the rootNode

    let node = rootNode.find(target); // once we have the target, we can just trace back through the parents for a reverse path
    let nodeList = [];
    while (node !== null) {
      nodeList.push(node.value);
      node = node.parent; // eventually this will get to "home", and then become null, which breaks out of the loop
    }
    
    // at this point, nodeList is the reverse path with "home" as the last element
    let path = nodeList.pop() ?? ""; // path starts with "home" (or is empty if list is empty)
    nodeList.reverse(); // now it's "left-to-right"
    for (let server of nodeList) {
      path += " -> " + server;
    }
    return path; // if not found, an empty string is returned
  }

`;
}

/** @param {NS} ns */
export async function main(ns) {
  ns.tprint(`Hello from "${ns.getScriptName()}"`);
}
