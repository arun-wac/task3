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


$(document).ready(function() {

    var popup = $(".popup");
    var popupWrapper = $(".popup-wrapper");
    var closeButton = $(".close-button");
    var popupTitle = $(".popup-title");
    var textarea = $("textarea.popup-item");
    var save = $(".save");
    var noteWrapper = $(".note-wrapper");
    var addNote = $(".add-note");
    var notesArray = JSON.parse(localStorage.getItem("notes"));
    var notesArrayBackup;
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
    var deletePopupWrapper = $(".delete-popup-wrapper");
    var deletePopup = $(".delete-popup");
    var deletePopupButton = $(".delete-button");
    var deleteCancel = $(".delete-cancel-button");
    var copy = $(".copy");
    var idToDelete = -1;
    var undo = $(".undo");
    var editIcon = $(".edit");

    var $grid = $('.grid').packery({
        itemSelector: '.grid-item',
        columnWidth: 310,
        columnHeight: 200,
        gutter: 15,
        originTop: true,
        originLeft: true
    });

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
        editIcon = $(".edit");
    }

    function popupReset() {
        popup.removeClass(colors);
        popup.addClass("white");

        $(colorPickerColors).removeClass("tick");
        $(colorPickerColors).removeClass("tickwhite");
        $(colorPickerColors[0]).addClass("tick");

        popup.find('.id').val('');
        popup.find('.title').val('');
        popup.find('.color').val('');
        popup.find('.content').val('');
        popup.find(".textarea").css({ "height": "auto", "overflow-y": "hidden", "max-height": "300px", "min-height": "30px" });
    }

    function loadEvents() {
        loadvariables();

        editIcon.on('click', function() {
            popupWrapper.removeClass("hidden");
            popupTitle.val($(this).closest(".note").find(".note-title").html());
            textarea.val($(this).closest(".note").find(".note-content").html());
            textarea.focus();
            var textareaheight = document.getElementById("textarea").scrollHeight;

            textarea.css({ "height": (textareaheight) + 'px', "overflow-y": "hidden", "max-height": "300px", "min-height": "30px" });
            if (textareaheight > 300) {
                textarea.css({ "height": "300px", "overflow-y": "scroll", "max-height": "300px", "min-height": "30px" });
            }

            textarea.focus();
            popup.find(".title").focus();

            $(".popup .id").val($(this).closest(".note").find(".id").val());
            $(".popup .color").val($(this).closest(".note").find(".color").val());
            backupColor = $(this).closest(".note").find(".color").val();

            popup.removeClass(colors);
            popup.addClass($(this).closest(".note").find(".color").val());

            var i, j;
            for (j = 0; j < colorPickerColors.length; j++) {

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
        });


        colorPickerColors.off('click').on('click', function(e) {
            e.stopPropagation();
            var currentId = $(this).closest(".note").find(".id").val();
            var currentColor = $(this).closest(".note").find(".color").val();
            var newColor = $(this).attr("value");
            newColor.replace("tick", '');
            newColor.replace("tickwhite", '');

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

        addNote.off('click').on('click', function() {
            var nextId = localStorage.getItem("nextId");
            popup.find(".id").val(nextId);
            popup.find(".color").val("white");

            popupWrapper.removeClass("hidden");
        });

        deleteIcon.off('click').on('click', function(e) {
            e.stopPropagation();
            // notesArrayLength = notesArray.length;
            idToDelete = $(this).closest(".note").find(".id").val();
            deletePopupWrapper.removeClass("hidden");

        });

        deletePopupButton.off('click').on('click', function(e) {
            if (e.target != this) {
                return false;
            }
            var i;
            notesArrayBackup = [...notesArray];

            for (i = 0; i < notesArrayLength; i++) {
                if (notesArray[i].id == idToDelete) {
                    $grid.packery("remove", notesArray[i]);
                    notesArray.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("notes", JSON.stringify(notesArray));
            idToDelete = -1;
            deletePopupWrapper.addClass("hidden");
            $('.toast').toast('show');
            e.stopPropagation();
            loadnotes();
        });

        deleteCancel.off('click').on('click', function(e) {
            if (e.target != this) {
                return false;
            }
            e.stopPropagation();

            idToDelete = -1;
            deletePopupWrapper.addClass("hidden");
        });

        deletePopupWrapper.off('click').on('click', function(e) {
            if (e.target != this) {
                return false;
            }
            e.stopPropagation();
            deletePopupWrapper.addClass("hidden");
        });

        undo.off('click').on('click', function(e) {
            // e.preventDefault();
            // e.stopPropagation();
            notesArray = [...notesArrayBackup];
            localStorage.setItem("notes", JSON.stringify(notesArray));
            loadnotes();
        })

        copy.off('click').on('click', function(e) {
            e.stopPropagation();
            var currentTitle = $(this).closest(".note").find(".title").html();
            var currentContent = $(this).closest(".note").find(".content").html();
            var currentColor = $(this).closest(".note").find(".color").val();

            notesArray.push({ id: nextId, title: currentTitle, content: currentContent, color: currentColor });
            nextId++;

            localStorage.setItem("nextId", nextId);
            localStorage.setItem("notes", JSON.stringify(notesArray));

            loadnotes();
        });

    }

    function loadnotes() {
        loadvariables();
        var i;
        var notes;
        noteWrapper.empty();
        for (i = 0; i < notesArrayLength; i++) {

            var id = notesArray[i].id;
            var title = notesArray[i].title;
            var content = notesArray[i].content;
            var color = notesArray[i].color;
            var j;

            var newElement = '<div class=" column grid-item note-item note ' + color + '">' +
                '<input type = "hidden" class="id" name = "id" value = "' + id + '" />' +
                '<input type="hidden" class="color" name="color" value="' + color + '" />' +
                '<h3 class="note-title text-center title">' + title + '</h3>' +
                '<div class="w-100 note-content-wrapper">' +
                '<p class="note-content content">' + content + '</p>' +
                '</div>' +
                '<div class="note-footer ">' +
                '<ul class="w-100 px-0 text-center">' +
                '<li class="edit"><i class="material-icons">&#xe3c9;</i></li>' +
                '<li class="delete">' + '<i class="material-icons">' + '&#xe872;' + '</i>' + '</li>' +
                '<li class="copy">' + '<i class="material-icons">content_copy</i>' + '</li>' +
                '</ul>' +
                '</div>' +
                '</div >';

            noteWrapper.append(newElement);
        }

        loadvariables();
        loadEvents();

        var k;
        for (k = 0; k < noteItem.length; k++) {
            $grid.packery('remove', noteItem[k]);
            $grid.packery('addItems', noteItem[k]);
        }

        $grid.packery('layout');

        $grid.find('.grid-item').each(function(i, gridItem) {
            var draggie = new Draggabilly(gridItem);
            // bind drag events to Packery
            $grid.packery('bindDraggabillyEvents', draggie);
        });

        $grid.on('dragItemPositioned',
            function(event, draggedItem) {
                var itemElems = $grid.packery('getItemElements');
                notesArray = [];
                var i;
                for (i = 0; i < itemElems.length; i++) {
                    var currentId = $(itemElems[i]).find(".id").val();
                    var currentColor = $(itemElems[i]).find(".color").val();
                    var currentTitle = $(itemElems[i]).find(".title").html();
                    var currentContent = $(itemElems[i]).find(".content").html();

                    notesArray.push({ id: currentId, title: currentTitle, content: currentContent, color: currentColor });
                }

                localStorage.setItem("notes", JSON.stringify(notesArray));
                return false;
            });
    }

    loadnotes();
    closeButton.on('click', function() {
        popupWrapper.addClass("hidden");
        popupTitle.val("");
        textarea.val("");

        var currentId = $(this).closest(".popup").find(".id").val();
        var currentColor = $(this).closest(".popup").find(".color").val();

        var currentNoteItem = $(".note-item .id[value=" + currentId + "]").closest(".note-item");
        currentNoteItem.removeClass(currentColor);
        currentNoteItem.addClass(backupColor);
        currentNoteItem.find(".color").val(backupColor);

        popup.removeClass(currentColor);

        popupReset();

        return false;
    });

    popupWrapper.off('click').on('click', function(e) {
        if (e.target != this) {
            return false;
        }
        popupWrapper.addClass("hidden");
        popupTitle.val("");
        textarea.val("");


        return false;
    });

    save.off('click').on('click', function() {
        var currentId = $(this).closest(".note").find(".id").val();

        var currentTitle = $(this).closest(".note").find(".popup-title").val();
        var currentContent = $(this).closest(".note").find(".popup-content").val();
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
                if (currentTitle == '' || currentContent == '') {
                    return false;
                }
                notesArray.push({ id: currentId, title: currentTitle, content: currentContent, color: currentColor });
                nextId++;
            }
            localStorage.setItem("nextId", nextId);
            localStorage.setItem("notes", JSON.stringify(notesArray));
        }
        popupReset();
        popupWrapper.addClass("hidden");

        loadnotes();

    });

    // localStorage.setItem("notes", JSON.stringify(jsonArray));

});




$(document).ready(function() {

    $('textarea').each(function() {
        if (this.scrollHeight > 30)
            $(this).css({ "height": (this.scrollHeight) + 'px', "overflow-y": "hidden", "max-height": "300px", "min-height": "30px" });
        if (this.scrollHeight > 300) {
            $(this).css({ "height": "300px", "overflow-y": "hidden", "max-height": "300px", "min-height": "30px" });
        }
    }).on('input', function() {
        $(this).css({ "height": "auto", "overflow-y": "hidden", "max-height": "300px", "min-height": "30px" });
        if (this.scrollHeight > 30)
            $(this).css({ "height": (this.scrollHeight) + 'px', "overflow-y": "hidden", "max-height": "300px", "min-height": "30px" });

        if (this.scrollHeight > 300) {
            $(this).css({ "height": "300px", "overflow-y": "scroll", "max-height": "300px", "min-height": "30px" });
        }
    });

});