/**
 * Classroom Shuffle
 *
 * This program allows the user to input names and create many (up to 20 (if possible for size of people))
 * different combos of partnerships. These partnerships can then be saved and accessed later
 *
 * This file handles the interactivity of the app
 *
 * @author Luke Halasy, lhalasy@gmail.com
 * @version April 29, 2018
 *
 * Comments should be better...
 *
 */

function addPartnersToList(
  currentPartnerListIndex,
  currentAllCombosList,
  mode
) {
  for (
    var i = 0;
    i < currentAllCombosList[currentPartnerListIndex].length;
    i++
  ) {
    //<li class="collection-item">Fred and Eric</li>
    if (
      currentAllCombosList[currentPartnerListIndex][i][0] != 'Nobody' &&
      currentAllCombosList[currentPartnerListIndex][i][1] != 'Nobody'
    ) {
      $('.partnerList').append(
        '<li class="collection-item">' +
          currentAllCombosList[currentPartnerListIndex][i][0] +
          ' and ' +
          currentAllCombosList[currentPartnerListIndex][i][1] +
          '</li>'
      );
    } else if (
      currentAllCombosList[currentPartnerListIndex][i][0] === 'Nobody'
    ) {
      $('.partnerList').append(
        '<li class="collection-item">' +
          currentAllCombosList[currentPartnerListIndex][i][1] +
          ' join a partnership</li>'
      );
    } else {
      $('.partnerList').append(
        '<li class="collection-item">' +
          currentAllCombosList[currentPartnerListIndex][i][0] +
          ' join a partnership</li>'
      );
    }
  }
}

function showPartnerListProgressOnHeader(
  currentPartnerListIndex,
  currentAllCombosListLength,
  currentPartnershipName
) {
  if (currentPartnershipName != null) {
    $('.partnersTitle').text(
      currentPartnershipName +
        ' (' +
        (currentPartnerListIndex + 1) +
        ' of ' +
        currentAllCombosListLength +
        ')'
    );
  } else {
    $('.partnersTitle').text(
      'Partners (' +
        (currentPartnerListIndex + 1) +
        ' of ' +
        currentAllCombosListLength +
        ')'
    );
  }
}

function addPerson(name) {
  function createNameCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }

  function isNameAlreadyUsed(name) {
    var people = [];

    $('.peopleList li').each(function() {
      //Make each pushed persons first letter capital and the rest negative
      var nameToPush = $(this)
        .text()
        .slice(0, $(this).text().length - 5);
      people.push(nameToPush);
    });

    if (people.includes(name) === true) {
      return true;
    } else {
      return false;
    }
  }

  name = createNameCase(name);
  if (isNameAlreadyUsed(name) === true) {
  } else {
    if (name != '') {
      $('.peopleList').prepend(
        '<li class="collection-item">' +
          name +
          '<a style="float: right"><i class="material-icons deletePerson clickableIcon">close</i></a></li>'
      );
      $('.personAdderInput').val('');
    }
  }
}

function savePartnership(name, currentPartnerListIndex, currentAllCombosList) {
  localStorage.setItem(
    'PartnerCreator: ' + name,
    JSON.stringify([currentAllCombosList, currentPartnerListIndex])
  );
}

$(document).ready(function() {
  var currentPartnerListIndex = 0;
  var currentAllCombosList = [];
  var currentPartnershipName = null;
  // Full Screen Mode Stuff
  $('#fullscreenPartnersModal').modal({
    dismissible: true
  });
  $('#saveModal').modal({
    dismissible: true
  });
  $('#retrieveSaveModal').modal({
    dismissible: true
  });

  $('.partnerShower').hover(function() {
    $(this).toggleClass('z-depth-5');
  });
  $('.partnerAdderForm').hover(function() {
    $(this).toggleClass('z-depth-5');
  });

  $('.peopleList').on('click', 'i', function() {
    $(this)
      .parent()
      .parent()
      .remove();
  });

  /*$(".deletePerson").click(function(e) {
        console.log("sleep");
        $(e.target).parent().parent().remove();
    });
    */

  $('.personAdderInput').keyup(function(e) {
    if (e.keyCode === 13) {
      var name = $(e.target).val();
      addPerson(name);
      //Store the varible in students array
      //console.log($(e.target).val());
    }
  });

  $('.addPerson').click(function(e) {
    name = $('.personAdderInput').val();
    addPerson(name);
    $('.personAdderInput').focus();
  });

  $('.refreshPeople').click(function(e) {
    $('.partnersTitle').text('Partners');
    $('.peopleList').empty();
    $('.partnerList').empty();
    currentAllCombosList = [];
    currentPartnerListIndex = 0;
    currentPartnershipName = null;
    $('.showWhenPartnersMade').css('display', 'none');
  });

  $('.retrieveSaveModalButton').click(function(e) {
    $('#retrieveSaveModal').modal('open');
    //list all saved files
    for (var i = 0, len = localStorage.length; i < len; ++i) {
      if (localStorage.key(i).slice(0, 15) === 'PartnerCreator:') {
        $('.saveFileList').prepend(
          '<li class="collection-item"><i class="material-icons deleteSaveFileButton clickableIcon" style="float: left">delete</i>' +
            localStorage.key(i).slice(16, localStorage.key(i).length) +
            '<a style="float: right"><i class="material-icons loadSaveFileButton clickableIcon">arrow_forward</i></a></li>'
        );
      }
    }
  });

  $('.saveFileList').on('click', 'i', function() {
    //if select button is pressed
    if (
      $(this)
        .parent()
        .text() === 'arrow_forward'
    ) {
      //we slice it because it add arrow_forward to the end of the text
      var name = $(this)
        .parent()
        .parent()
        .text()
        .slice(0, -13);
      name = name.slice(6, name.length);

      currentAllCombosList = JSON.parse(
        localStorage.getItem('PartnerCreator: ' + name)
      )[0];
      currentPartnerListIndex = JSON.parse(
        localStorage.getItem('PartnerCreator: ' + name)
      )[1];
      currentPartnershipName = name;

      $('.partnerList').empty();
      $('.peopleList').empty();

      for (var i = 0; i < 1; i++) {
        for (var j = 0; j < currentAllCombosList[0].length; j++) {
          addPerson(currentAllCombosList[0][j][0]);
          addPerson(currentAllCombosList[0][j][1]);
        }
      }

      showPartnerListProgressOnHeader(
        currentPartnerListIndex,
        currentAllCombosList.length,
        currentPartnershipName
      );
      addPartnersToList(currentPartnerListIndex, currentAllCombosList);

      $('.showWhenPartnersMade').css('display', 'inline');

      $('.saveFileList').empty();
      $('#retrieveSaveModal').modal('close');
    } else {
      //remove button is pressed
      var name = $(this)
        .parent()
        .text()
        .slice(0, -13);
      name = name.slice(6, name.length);
      console.log(localStorage.removeItem('PartnerCreator: ' + name));
      $(this)
        .parent()
        .remove();
    }
  });

  $('.closeRetrieveSaveModal').click(function(e) {
    $('.saveFileList').empty();
    $('#retrieveSaveModal').modal('close');
  });

  $('.sendPeople').click(function(e) {
    var people = [];
    $('.peopleList li').each(function() {
      people.push(
        $(this)
          .text()
          .slice(0, $(this).text().length - 5)
      );
    });

    if (people.length === 0 || people.length === 1) {
      console.log('thing');
      return 0;
    }

    $('.partnerList').empty();
    $('.showWhenPartnersMade').css('display', 'inline');
    currentAllCombosList = returnAllNamedCombos(people, 'scramble');
    currentPartnerListIndex = 0;
    currentPartnershipName = null;
    showPartnerListProgressOnHeader(
      currentPartnerListIndex,
      currentAllCombosList.length,
      currentPartnershipName
    );
    addPartnersToList(currentPartnerListIndex, currentAllCombosList);
  });

  $('.nextPartnerListArrow').click(function(e) {
    if (currentPartnerListIndex + 1 < currentAllCombosList.length) {
      $('.partnerList').empty();
      currentPartnerListIndex += 1;
      showPartnerListProgressOnHeader(
        currentPartnerListIndex,
        currentAllCombosList.length,
        currentPartnershipName
      );
      addPartnersToList(currentPartnerListIndex, currentAllCombosList);
    }
  });

  $('.fullscreenButton').click(function(e) {
    $('#fullscreenPartnersModal').modal('open');

    var partnersPerColumn = 8;
    $('.fullscreenPartnerListHolder div:nth-child(1) ul').empty();
    $('.fullscreenPartnerListHolder div:nth-child(2) ul').empty();
    $('.fullscreenPartnerListHolder div:nth-child(3) ul').empty();
    $('.fullscreenPartnerListHolder div:nth-child(4) ul').empty();

    var columnNumber = 1;
    for (
      var i = 0;
      i < currentAllCombosList[currentPartnerListIndex].length;
      i++
    ) {
      if (
        currentAllCombosList[currentPartnerListIndex][i][0] != 'Nobody' &&
        currentAllCombosList[currentPartnerListIndex][i][1] != 'Nobody'
      ) {
        $(
          '.fullscreenPartnerListHolder div:nth-child(' + columnNumber + ') ul'
        ).append(
          '<li class="collection-item">' +
            currentAllCombosList[currentPartnerListIndex][i][0] +
            ' and ' +
            currentAllCombosList[currentPartnerListIndex][i][1] +
            '</li>'
        );
      } else if (
        currentAllCombosList[currentPartnerListIndex][i][0] === 'Nobody'
      ) {
        $(
          '.fullscreenPartnerListHolder div:nth-child(' + columnNumber + ') ul'
        ).append(
          '<li class="collection-item">' +
            currentAllCombosList[currentPartnerListIndex][i][1] +
            ' join a partnership</li>'
        );
      } else {
        $(
          '.fullscreenPartnerListHolder div:nth-child(' + columnNumber + ') ul'
        ).append(
          '<li class="collection-item">' +
            currentAllCombosList[currentPartnerListIndex][i][0] +
            ' join a partnership</li>'
        );
      }
      columnNumber += 1;
      if (columnNumber == 5) {
        columnNumber = 1;
      }
    }
  });

  $('.openSaveModalButton').click(function(e) {
    $('#saveModal').modal('open');
  });

  $('.saveNameInput').keyup(function(e) {
    if (e.keyCode === 13) {
      var name = $(e.target).val();
      $(e.target).val('');
      currentPartnershipName = name;
      showPartnerListProgressOnHeader(
        currentPartnerListIndex,
        currentAllCombosList.length,
        currentPartnershipName
      );
      savePartnership(name, currentPartnerListIndex, currentAllCombosList);

      $('#saveModal').modal('close');
    }
  });

  $('.saveButton').click(function(e) {
    var name = $('.saveNameInput').val();
    $('.saveNameInput').val('');
    currentPartnershipName = name;
    showPartnerListProgressOnHeader(
      currentPartnerListIndex,
      currentAllCombosList.length,
      currentPartnershipName
    );
    savePartnership(name, currentPartnerListIndex, currentAllCombosList);
    $('#saveModal').modal('close');
  });

  $('.previousPartnerListArrow').click(function(e) {
    if (currentPartnerListIndex - 1 >= 0) {
      $('.partnerList').empty();
      currentPartnerListIndex += -1;
      showPartnerListProgressOnHeader(
        currentPartnerListIndex,
        currentAllCombosList.length,
        currentPartnershipName
      );
      addPartnersToList(currentPartnerListIndex, currentAllCombosList);
    }
  });
});
