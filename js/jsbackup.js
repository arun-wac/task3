"use strict";

var jsonArray = [{
        'id': '0',
        'title': 'Title',
        'content': 'Content',
        'color': 'white'
    },
    {
        'id': '1',
        'title': 'Some Title',
        'content': 'Some very very very very very very very very very very very very very very long content',
        'color': 'yellow'
    }
];

// localStorage.setItem("nextId", "2");

var nextId = localStorage.getItem("nextId");
if (nextId == null) {
    nextId = 0;
    localStorage.setItem("nextId", nextId);
}


var colors = [
    "white",
    "lightcyan",
    "aquamarine",
    "charteruse",
    "yellow",
    "gold",
    "orange",
    "tomato",
    "magenta",
    "red",
    "aqua",
    "dodgerblue",
    "navy",
    "saddlebrown",
    "grey",
    "black"
];

var lightColors = [
    "white",
    "lightcyan",
    "aquamarine",
    "charteruse",
    "yellow",
    "gold",
    "orange",
    "tomato",
    "aqua"
];

var darkColors = ["magenta",
    "red",
    "dodgerblue",
    "navy",
    "saddlebrown",
    "grey",
    "black"
];

var backupColor, backupTitle, backupContent;

var textContainer, textareaSize, input;
var autoSize = function() {
    // also can use textContent or innerText
    textareaSize.innerHTML = input.value + '\n';
};

document.addEventListener('DOMContentLoaded', function() {
    textContainer = document.querySelector('.textarea-container');
    textareaSize = textContainer.querySelector('.textarea-size');
    input = textContainer.querySelector('textarea');
    autoSize();
    input.addEventListener('input', autoSize);
});



$(document).ready(function() {

    var popup = $(".popup");
    var popupWrapper = $(".popup-wrapper");
    var closeButton = $(".close-button");
    var popupTitle = $(".popup-title");
    var textarea = $("textarea.popup-item");
    var textareaSize = $(".textarea-size");
    var save = $(".save");
    var noteWrapper = $(".note-wrapper");
    var addNote = $(".add-note");
    var notesArray = JSON.parse(localStorage.getItem("notes"));
    if (notesArray == null) {
        notesArray = [];
    }
    var notesArrayLength;
    if (notesArray == null) {
        notesArrayLength = 0;
    } else {
        notesArrayLength = notesArray.length;
    }
    var colorPicker = $(".color-picker");
    var colorPickerColors = $(".color-picker li");
    var noteItem = $(".note-item");
    var deleteIcon = $(".delete");
    var copy = $(".copy");

    function loadvariables() {
        colorPicker = $(".color-picker");
        colorPickerColors = $(".color-picker li");
        noteItem = $(".note-item");
        addNote = $(".add-note");
        deleteIcon = $(".delete");
        notesArray = JSON.parse(localStorage.getItem("notes"));
        if (notesArray == null) {
            notesArray = [];
        }
        if (notesArray == null) {
            notesArrayLength = 0;
        } else {
            notesArrayLength = notesArray.length;
        }
        copy = $(".copy");
    }

    function popupReset() {
        popup.removeClass(colors);
        popup.addClass("white");

        $(colorPickerColors).removeClass("tick");
        $(colorPickerColors).removeClass("tickwhite");
        $(colorPickerColors[0]).addClass("tick");
    }

    function loadEvents() {
        loadvariables();


        noteItem.click(function() {
            popupTitle.val($(this).find(".note-title").html());
            textarea.val($(this).find(".note-content").html());
            $(".popup .id").val($(this).find(".id").val());
            $(".popup .color").val($(this).find(".color").val());
            backupColor = $(this).find(".color").val();

            popup.removeClass(colors);
            popup.addClass($(this).find(".color").val());

            var i, j;
            for (j = 0; j < colorPickerColors.length; j++) {
                console.log($(colorPickerColors[j]));
                $(colorPickerColors[j]).removeClass("tick");
                $(colorPickerColors[j]).removeClass("tickwhite");
                if ($(colorPickerColors[j]).hasClass(backupColor)) {
                    for (i of lightColors) {
                        if ($(colorPickerColors[j]).hasClass(i)) {
                            $(colorPickerColors[j]).addClass("tick");
                        }
                    }
                    for (i of darkColors) {
                        if ($(colorPickerColors[j]).hasClass(i)) {
                            $(colorPickerColors[j]).addClass("tickwhite");
                        }
                    }
                }
            }
            popupWrapper.removeClass("hidden");
        });


        colorPickerColors.click(function(e) {
            e.stopPropagation();
            var currentId = $(this).closest(".note").find(".id").val();
            var currentColor = $(this).closest(".note").find(".color").val();
            var newColor = $(this).attr("class");
            newColor.replace(" tick", '');
            newColor.replace(" tickwhite", '');

            // console.log(currentId);
            // console.log(currentColor);

            colorPickerColors.removeClass("tick");
            colorPickerColors.removeClass("tickwhite");

            var i;
            var currentNoteItem = $(".note-item .id[value=" + currentId + "]").closest(".note-item");

            currentNoteItem.removeClass(currentColor);
            currentNoteItem.addClass(newColor);
            currentNoteItem.find(".color").val(newColor);


            popup.removeClass(currentColor);
            popup.addClass(newColor);
            popup.find(".color").val(newColor)


            for (i of lightColors) {
                if ($(this).hasClass(i)) {
                    $(this).addClass("tick");
                    return true;
                }
            }
            for (i of darkColors) {
                if ($(this).hasClass(i)) {
                    $(this).addClass("tickwhite");
                    return true;
                }
            }


        });

        addNote.click(function() {
            var nextId = localStorage.getItem("nextId");
            popup.find(".id").val(nextId);
            popup.find(".color").val("white");

            popupWrapper.removeClass("hidden");
        });

        deleteIcon.click(function(e) {
            e.stopPropagation();
            // notesArrayLength = notesArray.length;
            var idToDelete = $(this).closest(".note").find(".id").val();
            var i;
            for (i = 0; i < notesArrayLength; i++) {
                if (notesArray[i].id == idToDelete) {
                    notesArray.splice(i, 1);
                    break;
                }
            }

            console.log(notesArray);
            localStorage.setItem("notes", JSON.stringify(notesArray));

            loadnotes();

        });

        copy.click(function(e) {
            e.stopPropagation();
            var currentTitle = $(this).closest(".note").find(".title").html();
            var currentContent = $(this).closest(".note").find(".content").html();
            var currentColor = $(this).closest(".note").find(".color").val();

            notesArray.push({ id: nextId, title: currentTitle, content: currentContent, color: currentColor });
            nextId++;

            localStorage.setItem("nextId", nextId);
            localStorage.setItem("notes", JSON.stringify(notesArray));
            // console.log(notesArray);
            loadnotes();
        });

    }



    function loadnotes() {
        loadvariables();
        // notesArray = JSON.parse(localStorage.getItem("notes"));
        // notesArrayLength = notesArray.length;
        var i;
        var notes;
        noteWrapper.empty();
        // var newElement = '<div class="col-2 new-note">' +
        //     '<i class="material-icons add-note">add</i>' +
        //     '</div>';
        // noteWrapper.append(newElement);
        for (i = 0; i < notesArrayLength; i++) {

            var id = notesArray[i].id;
            var title = notesArray[i].title;
            var content = notesArray[i].content;
            var color = notesArray[i].color;
            var j;

            var newElement = '<div class=" col-3 grid-item mx-3 note-item note ' + color + '">' +
                '<input type = "hidden" class="id" name = "id" value = "' + id + '" />' +
                '<input type="hidden" class="color" name="color" value="' + color + '" />' +
                '<div class="row">' +
                '<h3 class="note-title text-center title">' + title + '</h3>' +
                '</div>' +
                '<div class="row w-100 note-content-wrapper">' +
                '<p class="note-content content">' + content + '</p>' +
                '</div>' +
                '<div class="row note-footer ">' +
                '<ul class="w-100 px-0 text-center">';
            //     '<li class="color-icon">' + '<i class="material-icons">' + 'color_lens' + '</i>' +
            //     '<div class="color-picker">';
            // for (j = 0; j < colors.length; j++) {
            //     if ((j + 1) % 4 == 1) {
            //         newElement += '<ul>';
            //     }
            //     newElement += '<li class="' + colors[j];
            //     if (colors[j] == color) {
            //         darkColors.find(() => colors[j])
            //         if (darkColors.includes(colors[j])) {
            //             newElement += ' tickwhite';
            //         } else {

            //             newElement += ' tick';
            //         }
            //     }
            //     newElement += '">' + '</li>';
            //     if ((j + 1) % 4 == 0) {
            //         newElement += '</ul>'
            //     }
            // }

            // newElement += '</div>' +
            //     '</li>' +

            newElement += '<li class="edit">' + '<i class="material-icons">' + '&#xe3c9;' + '</i>' + '</li>' +
                '<li class="delete">' + '<i class="material-icons">' + '&#xe872;' + '</i>' + '</li>' +
                '<li class="copy">' + '<i class="material-icons">content_copy</i>' + '</li>'
            '</ul>' +
            '</div>' +
            '</div >';



            noteWrapper.append(newElement);
        }

        loadvariables();
        loadEvents();
    }

    loadnotes();







    closeButton.click(function() {
        popupTitle.val("");
        textarea.val("");
        textareaSize.html("");


        var currentId = $(this).closest(".popup").find(".id").val();
        var currentColor = $(this).closest(".popup").find(".color").val();

        var currentNoteItem = $(".note-item .id[value=" + currentId + "]").closest(".note-item");
        currentNoteItem.removeClass(currentColor);
        currentNoteItem.addClass(backupColor);
        currentNoteItem.find(".color").val(backupColor);

        popup.removeClass(currentColor);

        popupReset();
        popupWrapper.addClass("hidden");
        return false;
    });

    popupWrapper.click(function(e) {
        if (e.target != this) {
            return false;
        }
        popupTitle.val("");
        textarea.val("");
        textareaSize.html("");

        popupWrapper.addClass("hidden");
        return false;
    });

    save.click(function() {
        var currentId = $(this).closest(".note").find(".id").val();

        var currentTitle = $(this).closest(".note").find(".popup-title").val();
        var currentContent = $(this).closest(".note").find(".popup-content .popup-item").val();
        var currentColor = $(this).closest(".note").find(".color").val();


        if (currentId != '') {
            var currentNoteItem = $(".note-item .id[value=" + currentId + "]").closest(".note-item");
            currentNoteItem.find(".note-title").html(currentTitle);
            currentNoteItem.find(".note-content").html(currentContent);

            var i;
            for (i = 0; i < notesArrayLength; i++) {
                if (notesArray[i].id == currentId) {
                    notesArray[i].title = currentTitle;
                    notesArray[i].content = currentContent;
                    notesArray[i].color = currentColor;
                    break;
                }
            }
            if (i == notesArrayLength) {
                // currentId = notesArray.length;
                if (currentTitle == '' || currentContent == '') {
                    return false;
                }
                notesArray.push({ id: currentId, title: currentTitle, content: currentContent, color: currentColor });
                nextId++;
            }


            // notesArray.push({ id: currentId, title: currentTitle, content: currentContent, color: currentColor });
            localStorage.setItem("nextId", nextId);
            localStorage.setItem("notes", JSON.stringify(notesArray));
        }
        popupReset();
        popupWrapper.addClass("hidden");

        loadnotes();

    });




    // console.log(JSON.stringify(jsonArray));
    // localStorage.setItem("notes", JSON.stringify(jsonArray));

    console.log(localStorage.getItem("notes"));

});




$(document).ready(function() {
    $(function() {
        $(".note-wrapper").sortable();
        $(".note-wrapper").disableSelection();
    });
});