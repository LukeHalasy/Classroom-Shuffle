/**
 * Classroom Shuffle
 *
 * This program allows the user to input names and create many (up to 20 (if possible for size of people))
 * different combos of partnerships. These partnerships can then be saved and accessed later
 *
 * This file handles the
 * behind the scenes aspect of partner creation.
 *
 *
 * @author Luke Halasy, lhalasy@gmail.com
 * @version April 29, 2018
 *
 */

/**
 * Data value that will represent each created pairs/partner
 *
 * @param {array} data The pair that will be represented ex: [1, 2]
 * @param {array or undefined} blacklist used when backtracking to previous combo to eliminate
 * a certain value so another combo can use the partnership
 * No other nodes in the combo can have a value=blacklist
 */
function Node(data, blacklist) {
  this.data = data;
  //Holds all possible remain pairs to add to the current combo for the given partner node
  this.childrenToAdd = undefined;
  this.permaBlackListedNodes = blacklist;
}

/**
 * Creates all possible usable pairs for
 * the current calling combo
 *
 * @param {multi-dimensional array} alreadyUsedPairs Holds all
 * used pairs for the current combo ex: [[0, 1], [2, 3]]
 * @param {multi-dimensional array} allPairs Globally used, but locally parameritized
 * Holds all pairs for people
 * @return {mulit-dimensional array} with all remaining pairs
 * ex: Given
 * people = [0, 1, 2, 3, 4, 5]
 * alreadyUsedPairs = [[0, 1], [2, 3]]
 * allPairs = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3],
 * [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]]
 * returns [[4, 5]]
 */

function getRemainingPossiblePairs(alreadyUsedPairs, allPairs) {
  // holds used people for later sorting of allPairs
  var alreadyUsedPeople = [];
  //extrapolates all people that are in the already used pairs
  for (var i = 0; i < alreadyUsedPairs.length; i++) {
    alreadyUsedPeople.push(alreadyUsedPairs[i][0]);
    alreadyUsedPeople.push(alreadyUsedPairs[i][1]);
  }

  //will be returned to function caller
  var remainingPossiblePairs = [];

  //Iterates throuhgh all pairs
  //If the pair doesn't contain any of the already used people
  //Then it pushes its value to remainingPossiblePairs

  for (var i = 0; i < allPairs.length; i++) {
    if (containsAlreadyUsedPeople(allPairs[i], alreadyUsedPeople) === false) {
      remainingPossiblePairs.push(allPairs[i]);
    }
  }

  return remainingPossiblePairs;
}

/**
 * Boolean function that checks to see if any used people
 * are contained within a given partnership
 *
 * @param {array} pairInQuestion Holds the two members of the checked pairs
 * @param {array} alreadyUsedPeople Holds all used people within the current combo
 * @return {boolean} true if the pair contains any used people and vice versa
 * ex: Given
 * pairInQuestion = [1, 2]
 * alreadyUsedPeople = [3, 4, 5, 6, 7]
 * returns false
 */

function containsAlreadyUsedPeople(pairInQuestion, alreadyUsedPeople) {
  //loops through alreadyUsedPeople and checks if either member of
  //the pair in question is equal to alreadyUsedPeople[i]
  for (var i = 0; i < alreadyUsedPeople.length; i++) {
    if (
      pairInQuestion[0] === alreadyUsedPeople[i] ||
      pairInQuestion[1] === alreadyUsedPeople[i]
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Creats all pairs for a given set of people
 *
 * @param {array(int)} people Holds all people
 * @return {multi-dimensional array} containing all pairs
 * ex: Given
 * people = [0, 1, 2, 3]
 * returns [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
 */

function createAllPairs(people) {
  var allCombos = [];
  for (var i = 0; i < people.length - 1; i++) {
    for (var j = i + 1; j < people.length; j++) {
      allCombos.push([people[i], people[j]]);
    }
  }
  return allCombos;
}

/**
 * Returns the path for the given partner Node, and combo
 *
 * @param {array} currentComboArray Holds the partner nodes within the current combo
 * @return {multi-dimensional array} with all current combo partner values
 * ex:
 * Given
 * currentComboArray = [Node([0, 1], []), Node([2, 3], [])]
 * returns [[0, 1], [2, 3]]
 */

function getPath(currentComboArray) {
  var path = [];
  //loops through the given array and pushes each partner node's data
  //into the path array
  for (var i = 0; i < currentComboArray.length; i++) {
    path.push(currentComboArray[i].data);
  }
  return path;
}

/**
 * Returns the last partnership for a combo missing one more partner
 * Used when the program needs to backtrack to the combo containing the needed
 * partner in order to free it for use
 *
 * May seem synonymous to getRemainingPossiblePairs, but this function
 * doesn't take the allPairs array into account.
 * Thus the termVal return array can be a partnership that has already been used
 * in another combo
 *
 * @param {multi-dimensional array} path Holds all the currently used partners
 * in the current combo
 * @param {array(int)} people Holds all the people for the current running program
 * @return {array} Contains the missing partnership for the combo
 * ex: Given
 * path = [[0, 1], [2, 3]]
 * people = [0, 1, 2, 3, 4, 5]
 * returns [4, 5]
 */

function getTermVal(path, people) {
  //Copy the people array to prevent changing the value of people
  //within the called function
  var copyOfPeople = [];
  for (var i = 0; i < people.length; i++) {
    copyOfPeople.push(people[i]);
  }
  //eliminate each person that has been used in path
  //from the copyOfPeople array
  for (var i = 0; i < path.length; i++) {
    copyOfPeople.splice(copyOfPeople.indexOf(path[i][0]), 1);
    copyOfPeople.splice(copyOfPeople.indexOf(path[i][1]), 1);
  }
  //Return the only two remaing values in copyOfPeople
  //The two remaining people are the termVal
  return [copyOfPeople[0], copyOfPeople[1]];
}

/**
 * Iterates through a given partnerList and searches for partnership
 * If it finds it, the function returns the index.
 *
 * @param {multi-dimensional array} partnerList Contains all given partners
 * @param {array} partnership Holds the the partnership in question
 * @return {int} Index of the blacklisted partnership in the provided partnerList, or -1 if
 * the given partnership is not in the partnerList
 * ex: Given
 * partnerList = [[0, 1], [2, 3], [4, 5]]
 * partnership = [4, 5]
 * returns 2
 */

function partnershipInArrayIndex(partnerList, partnership) {
  // Default the index of blackListedPartnership to -1
  var index = -1;
  // Return -1 if blacklistedPartner isn't even a partnership
  if (partnership === undefined) {
    return -1;
  }
  //iterate through the given partnerList, checking each partner, to see if
  //it equals the corresponding partner in blacklistedPartnership
  for (var i = 0; i < partnerList.length; i++) {
    if (
      partnerList[i][0] == partnership[0] &&
      partnerList[i][1] == partnership[1]
    ) {
      index = i; // Found
      break;
    }
  }
  return index; // Not found
}

/**
 * MAIN BRUTE FUNCTION
 *
 * The main powerhorse of the application.
 * This function creates a combo
 *
 * @param {array(Node)} comboArray Contains all partnerNodes for the current combo
 * usually just the first, head partner
 * @param {array(int)} people Contains all people that are being used in the partnerships
 * @param {multi-dimensional array} allPairs Contains all possible partnerships
 * @param {multi-dimensional array} allCombos Contains all made combos
 * @return {multi-dimensional array} Holds all partners for the combo
 * ex: Given
 * comboArray = [Node([0, 1])]
 * people = [0, 1, 2, 3, 4, 5]
 * allPairs = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3],
 * [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]]
 * allCombos = [[Node([0, 1])], [Node([0, 2])], [Node([0, 3])], [Node([0, 4])], [Node([0, 5])]]
 * returns [[0, 1], [2, 3], [4, 5]]
 */

function getCombo(comboArray, people, allPairs, allCombos) {
  //termVal will hold the last needed value for a combo, if their are no more
  //children to add to the last partner node
  var termVal;
  //continue to add partners to the combo
  //until the combo uses all members of people (partners = half of people length)
  while (comboArray.length != people.length / 2) {
    //set the current partnerNode to be the last partnerNode in the combo
    var currNode = comboArray[comboArray.length - 1];
    //runs if the current partnerNode is new
    //adds children(partners) to add to the current partnerNode
    if (currNode.childrenToAdd === undefined) {
      //get all possible partners to add to the current combo
      var rpp = getRemainingPossiblePairs(getPath(comboArray), allPairs);
      //runs if the currPartnerNode's blacklisted node is in the possible partners to add list
      if (partnershipInArrayIndex(rpp, currNode.permaBlackListedNodes) != -1) {
        //remove the blacklisted node from the possible partners to add list
        rpp.splice(
          partnershipInArrayIndex(rpp, currNode.permaBlackListedNodes),
          1
        );
      }
      /*
      split the remaining pairs in half because...
      example:
      given
      people = [0, 1, 2, 3, 4, 5]
      comboArray = [Node([0, 1])]
      then
      rpp = [[2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]]
      combos that could be created from this are symettrical
      example(s):
      -------------------------
      (0, 1) -> (2, 3) -> (4, 5)
      (0, 1) -> (4, 5) -> (2, 3)
      -------------------------
      (0, 1) -> (2, 4) -> (3, 5)
      (0, 1) -> (3, 5) -> (2, 4)
      -------------------------
      (0, 1) -> (2, 5) -> (3, 4)
      (0, 1) -> (3, 4) -> (2, 5)
      splitting the rpp list in half saves what would be wasted cpu process time
      */
      rpp.splice(0, rpp.length / 2);

      //push remainingPossiblePairs to the
      //partnerNode's childrenToAdd list
      currNode.childrenToAdd = [];
      for (var i = 0; i < rpp.length; i++) {
        currNode.childrenToAdd.push(rpp[i]);
      }
    }

    //runs if their are childrenToAdd for the current partnerNode
    if (currNode.childrenToAdd.length !== 0) {
      //add a new partnerNode to the comboArray with the first available childrenToAdd Node
      //and also let the new node inherit the parents blacklisted nodes
      comboArray.push(
        new Node(currNode.childrenToAdd[0], currNode.permaBlackListedNodes)
      );
    }
    //if their are no childrenToAdd for the current partnerNode
    else {
      //runs if the combo array has enough partners
      //to have a parent and a child partnerNode
      if (comboArray.length >= 2) {
        //current partner node's "parent" (previous partner node in list)
        var parentNode = comboArray[comboArray.length - 2];
        /*
        remove the current partnerNode value from the parentNode's
        children to add list
        This prevents the parentNode from going down this partner path again
        */
        parentNode.childrenToAdd.shift();
      }
      //runs if the combo array has enough partners
      //to have a grandpa partnerNode (3 partners or more)
      if (comboArray.length >= 3) {
        var grandpaNode = comboArray[comboArray.length - 3];
        /*
          remove the current partner node's value from it's grandparent
          I do this to prevent unnessary repition
          Example:
          given
          people = [0, 1, 2, 3, 4, 5, 6, 7]
          comboArray = [Node(0, 1), Node(2, 3), Node(4, 5)]
          the remaining possible pairs of Node(0, 1) if we needed to backtrack
          because their were no children for the current partner node and the 
          parent partner node would include (4, 5) which would be repetive

          (0, 1) -> (2, 3) -> (4, 5)
          ===
          (0, 1) -> (4, 5) -> (2, 3)
          */
        if (grandpaNode.childrenToAdd.indexOf(currNode.data) != -1) {
          grandpaNode.childrenToAdd.splice(
            grandpaNode.childrenToAdd.indexOf(currNode.data),
            1
          );
        }
      }

      /*
      Runs if the combo only required one more combo to be complete
      and the head partnerNode has no more childrenToAdd (still will be equal to 1, because the currNode hasn't
      been removed from childrenToAdd list) 
      */
      if (
        comboArray.length + 1 === people.length / 2 &&
        comboArray[0].childrenToAdd.length === 1
      ) {
        //sets termVal = last needed partnership to complete the combo
        termVal = getTermVal(getPath(comboArray), people);
      }

      //runs if the combo is at a dead end cause the headNode has no children to add
      if (comboArray.length === 1) {
        //iterate through allCombos searching for termVal(last needed partnership to complete the current combo)
        for (var i = 0; i < allCombos.length; i++) {
          //runs if the termVal is contained within the currently iterated combo in allCombos
          if (partnershipInArrayIndex(allCombos[i], termVal) != -1) {
            //add all partners contained within the combo that contains the termVal
            //back to the allPairs list to allow future combos to use their partners
            for (var x = 0; x < allCombos[i].length; x++) {
              allPairs.push(allCombos[i][x]);
            }

            //reset the the combo that contained termValue to it's headNode
            allCombos[i][0] = new Node(allCombos[i][0]);
            allCombos[i].splice(1, allCombos[i].length);

            //add termVal to the combo that contained termValue
            //so that it cannot use that certain partnership in it's
            //new combo
            allCombos[i][0].permaBlackListedNodes = termVal;

            //create a new combo for the combo that contained termValue
            //thus freeing termVal to be used by the current combo
            allCombos[i] = getCombo(allCombos[i], people, allPairs, allCombos);
            //reset the current combo's head node childrenToAdd list
            //so that childrenToAdd can now contain termVal
            currNode.childrenToAdd = undefined;
            //break the loop to save cpu time and prevent errors
            //we no longer need to free up termVal
            break;
          }
        }
      }
      //runs if combo length is greater than 1
      else {
        //removes the current partnershipNode from the comboArray
        //thus allowing the parentNode to add a new partnerNode
        //to try and create a succesful combo
        comboArray.splice(-1, 1);
      }
    }
  }

  /*
  RETURN VAL:
  convert the currentCombo of Node's
  into a path of their respective partnerships values
  */
  combo = getPath(comboArray);

  //iterates through the combo and removes all used partnerships
  //from the allPairs list
  for (var i = 0; i < combo.length; i++) {
    allPairs.splice(allPairs.indexOf(combo[i]), 1);
  }

  return combo;
}

/**
 * calls the getCombo function and handles the making of the template
 * and parameters for the call
 *
 * @param {array(int)} people Holds all the people for the currently running program
 * @param {multi-dimensional array} allPairs contains all possible partnerships
 * @return {multi-dimensional array} that holds all created combinations of partners
 * ex:
 * Given
 * people = [0, 1, 2, 3]
 * allPairs = [[0, 1], [0, 2], [0,3], [1, 2], [1, 3], [2,3]]
 * returns [[[0, 1],[2, 3]], [[0, 2],[1, 3]], [[0, 3],[1, 2]]]
 */

function createAllNumberedCombos(people, allPairs) {
  var allCombos = [];
  //runs if their is 20 or less given people
  if (people.length <= 20) {
    for (var i = 0; i < people.length - 1; i++) {
      allCombos.push([new Node(allPairs[i])]);
    }
  }
  //runs if their is more than 20 people
  else {
    /*
    Creates only 20 combination of partners
    This is done to speed up the program
    It's a tradeoff of ability (all possible combos)
    for speed (could take minutes if I did all possible combos)
    */
    for (var i = 0; i < 20; i++) {
      allCombos.push([new Node(allPairs[i])]);
    }
  }

  for (var j = 0; j < allCombos.length; j++) {
    allCombos[j] = getCombo(allCombos[j], people, allPairs, allCombos);
  }
  return allCombos;
}

/**
 * converts array of strings (people names) to integers
 * to increase the speed of subsequent function calls
 *
 * @param {array(string)} people Holds all the people for the currently running program
 * @return {array} of people as integer values
 * ex:
 * Given
 * people = ["Andrew", "Sam", "Nathan"]
 * returns [0, 1, 2]
 */

function peopleAsNumbers(people) {
  var peopleAsNumbers = [];
  for (var i = 0; i < people.length; i++) {
    peopleAsNumbers.push(i);
  }
  return peopleAsNumbers;
}

/**
 * converts all of the created numerical combos
 * to equivalent string form with their relative people string
 *
 * @param {multi-dimensional array} allCombos Holds all combinations of partnerships
 * @param {array (Strings)} people Holds all the people for the currently running program
 * @return {multi-dimensional array} of all combos of partners in string form
 * ex:
 * Given
 * allCombos = [[[0, 1], [2, 3]]]
 * people = ["Andrew", "Nathan", "Sam", "Austin"]
 * returns [["Andrew", "Nathan"], ["Sam", "Austin"]]
 */

function numberedCombosToNames(allCombos, people) {
  for (var i = 0; i < allCombos.length; i++) {
    for (var j = 0; j < allCombos[i].length; j++) {
      allCombos[i][j][0] = people[allCombos[i][j][0]];
      allCombos[i][j][1] = people[allCombos[i][j][1]];
    }
  }
  return allCombos;
}

/**
 * Scrambles final combos to make the end result look more random to the onlookers
 * Additionally, prevents the same kids from always appearing at the top of the list and
 * realizing some sort of pattern
 *
 * @param {multi-dimensional array} finalCombos Holds all combinations of partnerships
 * @returns {mulit-dimensional array} shuffled all combinations list
 * ex:
 * Given
 * finalCombos = [[["Andrew", "Nathan"], ["Sam", "Austin"]], [["Andrew, Austin"], ["Nathan", "Sam"]]]
 * returns [[["Sam", "Austin"],["Andrew", "Nathan"]], [["Andrew", "Austin"], ["Nathan", "Sam"]]];
 *
 */

function scrambledFinalCombos(finalCombos) {
  /**
   *
   * @param {array} a combo to be shuffled
   * @return {array} shuffled combo list
   */
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  //iterates through and shuffles all the final combos
  for (var i = 0; i < finalCombos.length; i++) {
    finalCombos[i] = shuffle(finalCombos[i]);
  }
  return finalCombos;
}

/**
 * Function that will be called when the user presses the send button
 *
 * @param {array(string)} people Holds all the people for the currently running program
 * @param {string} mode mode that the function caller wishes to use. ex: "scrambled"
 * @returns {mulit-dimensional array} of all named combinations of partnerships
 */

function returnAllNamedCombos(people, mode) {
  // if their is an odd number of people
  // add "Nobody" so that their is no sorting issues
  if (people.length % 2 != 0) {
    people.push('Nobody');
  }
  //numerate each person to speed up future function calls
  var numberedPeople = peopleAsNumbers(people);

  //create all possible partners
  var allPairs = createAllPairs(numberedPeople);
  var numberedCombos = createAllNumberedCombos(numberedPeople, allPairs);
  finalCombos = numberedCombosToNames(numberedCombos, people);

  //scramble all the final combos if the mode is scrambled
  if (mode === 'scramble') {
    finalCombos = scrambledFinalCombos(finalCombos);
  }

  return finalCombos;
}
