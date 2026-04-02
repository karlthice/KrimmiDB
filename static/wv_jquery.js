

// Gets the given persistent value, stored in local storage
function GetPersistentBool(inKey, inDefault)
{
    if (localStorage) {
        if (!localStorage.getItem('persistent_' + inKey))
            return inDefault;
        return localStorage.getItem('persistent_' + inKey) == '1';
    }
    return false;
}
// Sets the given persistent value, stored in local storage
function SetPersistentBool(inKey, inValue) {

    if (localStorage)
        localStorage.setItem('persistent_' + inKey, (inValue ? '1' : '0'));
}


function CloseOptionPopup()
{
    $(".wv_ConfirmPopup").remove();
}

// Option popup, 'inElement' will position popup near it, if null then in the middle of the screen
// inOptions = [{OptionText: <string>, OptionCallback: callback, OptionSpecial: <boolean>}, ...]
function OptionPopup(inElement, inTitle, inOptions) {
    // Remove previous popups
    if ($(".wv_ConfirmPopup").length > 0) {
        $(".wv_ConfirmPopup").remove();
        return;
    }

    if (!inOptions)
        return;

    // Display a confirm panel
    var dlgConfirm = "<div class='wv_ConfirmPopup'>";
    dlgConfirm += "<div class=\"wv_ConfirmPopupClose\"><img src='/static/images/close_red.png' title='Loka glugga'/></div>";
    dlgConfirm += "" + inTitle + "<br><br>";

    // Options
    for (var i = 0; i < inOptions.length; i++) {
        var oOption = inOptions[i];
        if (oOption.OptionSpecial)
            dlgConfirm += "<span id='id_confirmpopup_" + i + "' class='wv_FlatButtonLargeRed' style='float:right'>" + oOption.OptionText + "</span>";
        else
            dlgConfirm += "<span id='id_confirmpopup_" + i + "' class='wv_FlatButtonLarge'>" + oOption.OptionText + "</span>";
    }
    dlgConfirm += "</div>";

    var eDialog;
    if (inElement) {
        $("body").append(dlgConfirm);
        eDialog = $(".wv_ConfirmPopup");
        var iWidth = eDialog.width();
        var iHeight = eDialog.height();
        var iTop = $(inElement).offset().top - iHeight;
        if (iTop > 0)
            eDialog.css("top", $(inElement).offset().top - iHeight + "px");
        else
            eDialog.css("top", "0px");
        if (($(inElement).offset().left - iWidth) < 0)
            eDialog.css("left", "0px");
        else
            eDialog.css("left", $(inElement).offset().left - iWidth + "px");
    }
    else {
        $("body").append(dlgConfirm);
        eDialog = $(".wv_ConfirmPopup");
        eDialog.css("left", "50%");
        eDialog.css("bottom", "50%");
    }

    eDialog.show();

    // Handlers
    $.each(inOptions, function (index, option) {
        var eButton = $(".wv_ConfirmPopup #id_confirmpopup_" + index);
        $(eButton).off().on("click", function () {
            $(".wv_ConfirmPopup").remove();
            if (inOptions[index].hasOwnProperty("OptionCallback"))
                (inOptions[index].OptionCallback)();
        });

    });

    $(".wv_ConfirmPopupClose").off().on("click", function () {
        $(".wv_ConfirmPopup").remove();
    });
}


// Confirm popup.  'inElement' will position popup near it, if null then in the middle of the screen
function ConfirmPopup(inElement,inTitle, inYesText, inNoText, inYesCallback, inNoCallback)
{
    // Remove previous popups
    if ($(".wv_ConfirmPopup").length > 0) {
        $(".wv_ConfirmPopup").remove();
        return;
    }

    // Display a confirm panel
    var dlgConfirm = "<div class='wv_ConfirmPopup'>";
    dlgConfirm += "<div class=\"wv_ConfirmPopupClose\"><img src='/static/images/close_red.png' title='Loka glugga'/></div>";
    dlgConfirm += "" + inTitle + "<br><br>";
    if (inYesText)
        dlgConfirm += "<span id='id_confirmpopup_yes' class='wv_FlatButtonLarge'>" + inYesText + "</span>";
    if (inNoText)
        dlgConfirm += "<span id='id_confirmpopup_no' class='wv_FlatButtonLarge'>" + inNoText + "</span>";
    dlgConfirm += "</div>";

    var eDialog;
    if (inElement) {
        $("body").append(dlgConfirm);
        eDialog = $(".wv_ConfirmPopup");
        var iWidth = eDialog.width();
        var iHeight = eDialog.height();
        var iTop = $(inElement).offset().top - iHeight;
        if (iTop > 0)
            eDialog.css("top", $(inElement).offset().top - iHeight + "px");
        else
            eDialog.css("top", "0px");

        if (($(inElement).offset().left - iWidth) < 0)
            eDialog.css("left","0px");
        else
            eDialog.css("left", $(inElement).offset().left - iWidth + "px");
    }
    else {
        $("body").append(dlgConfirm);
        eDialog = $(".wv_ConfirmPopup");
        eDialog.css("left", "50%");
        eDialog.css("bottom", "50%");
    }

    eDialog.show();

    $(".wv_ConfirmPopup #id_confirmpopup_yes").off().on("click", function () {
        $(".wv_ConfirmPopup").remove();
        if (inYesCallback)
            (inYesCallback)();
    });
    $(".wv_ConfirmPopup #id_confirmpopup_no").off().on("click", function () {
        $(".wv_ConfirmPopup").remove();
        if (inNoCallback)
            (inNoCallback)();
    });
    $(".wv_ConfirmPopup").off().on("click", function () { return false; });
    $(".wv_ConfirmPopupClose").off().on("click", function () {
        $(".wv_ConfirmPopup").remove();
        if (inNoCallback)
            (inNoCallback)();
    });
}



// Rule button
(function ($) {

    $.fn.RuleButton = function (options)
    {
        var opts = $.extend(
        {
            caption: 'Caption',
            lastrundate: '',
            patientssn: ''
        },
        options);

        return this.each(
        function ()
        {
            var sRuleButton = "<div class='rulebutton_wrapper'>";
            sRuleButton += "<div class='rulebutton_caption'>" + opts.caption + "</div>";
            sRuleButton += "<div class='rulenbutton_date'>" + lastrundate + "</div>";
            sRuleButton += "</div>";
            var eRuleButton = $(this).wrap(sRuleButton);
            eRuleButton.bind("click", function ()
            {
            });
        });

    }


})(jQuery);


// Option button
(function ($)
{
    $.fn.OptionButton = function (options)
    {
        var opts = $.extend(
        {
            caption: 'Caption',
            options: [{ label: 'Yes', id: '1' }, { label: 'No', id: '0'}],          // Options to display
            selectedindex: 1
        },
        options);

        return this.each(
        function ()
        {
            var sOptions = "<div class='optionbutton_wrapper'></div>";
            sOptions += "<div class='optionbutton_caption'>" + opts.caption + " - ";
            sOptions += "<div class='optionbutton_selected'>" + opts.options[opts.selectedindex].label + "</div>";
            sOptions += "</div>";
            for (var i = 0; i < opts.options.length; i++)
            {
                var id = opts.options[i].label;
                sOptions += "<div class='optionbutton_unselected'>" + opts.options[i].label + "</div>";
            }
            sOptions += "</div>";
            var eOptionButton = $(this).wrap(sOptions);
//            var eOptionButton = $(sOptions).insertBefore($(this));
            eOptionButton.bind("click", function ()
            {
                var eDiv = $(this).next();
            });
        });

    }
})(jQuery);


// Persistent Toggle div Jquery extension
(function ($)
{
    $.fn.ToggleDiv = function (options)
    {

        var opts = $.extend(
    {
        whenopentext: 'Fela',       // Text to display when div is visible
        whenclosedtext: 'Birta',    // Text to display when div is hidden
        buttonclass: '', // Button class
        buttonstyle: '', // Additional button styles
        initialhide: false,  // True iff the toggle should be hidden initially
        onhiding: null,  // Callback when hiding
        onshowing: null  // Callback when showing
    },
    options);

        return this.each(
        function ()
        {
            // Add a toggle button
            var sButton = "<input type='button' style='" + opts.buttonstyle + "' class='" + opts.buttonclass + "' data-opentext='" + opts.whenopentext + "' data-closetext='" + opts.whenclosedtext + "' value='" + opts.whenopentext + "'/>";
            var eButton = $(sButton).insertBefore($(this));

            eButton.bind("click", function ()
            {
                // Toggle the div
                var eDiv = $(this).next();
                if ($(eDiv).is(':visible'))
                {
                    if (opts.onhiding)
                        opts.onhiding();
                    $(eDiv).hide();
                    $(this).val($(this).attr('data-closetext'));
                    if (localStorage)
                        localStorage.setItem('toggle_' + eDiv.attr('id'), '0');
                }
                else
                {
                if (opts.onshowing)
                    opts.onshowing();
                $(eDiv).show();
                $(this).val($(this).attr('data-opentext'));
                if (localStorage)
                    localStorage.setItem('toggle_' + eDiv.attr('id'), '1');
                }

            });

            // Start by toggling it?
            if (localStorage)
            {
                if (localStorage.getItem('toggle_' + $(this).attr('id')) == '0')
                    eButton.trigger('click');
                else if (localStorage.getItem('toggle_' + $(this).attr('id')) == '1')
                    ;
                else if (opts.initialhide)
                    eButton.trigger('click');
            }
        });

    }
})(jQuery);




// Only use with em-font sizes
function IncreaseFontSize(inPercentageInc) {
    $("*").each(function () {
        var iFont = parseFloat($(this).css("font-size"));
        if (iFont == undefined || iFont == null || iFont == 0)
            return;
        $(this).css("font-size", iFont * 1, 5 + "em");
    }
    );
}

// Dialog data functions
function GetDialogData()
{
    if (localStorage)
    {
        var o = localStorage.getItem("HG_DialogData");
        if (o == undefined || o == null)
            return {};
        return JSON.parse(o);
    }
    return {};
}

function tt()
{
    alert(1);
}

function SetDialogData(o) 
{
    if (localStorage) {
        var s = JSON.stringify(o);
        localStorage.setItem("HG_DialogData", s);
    }
}

// Translates the text() of the given element
function TranslateText(inID, inCallback)
{

    var t = $(inID).text();
    $.ajax({
        type: "POST",
        url: "../../DefaultDiv.aspx/TranslateText",
        data: "{'inText': '" + encodeURIComponent(t) + "'}",
        cache: false,
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg)
        {
            inCallback(msg.d);
        },
        error: function (xhr, ajaxOptions, thrownError)
        {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function CloseQuickPanel(inTag)
{
    if (!inTag)
        $(".wv_QuickPanel").remove();
    else
        $(".wv_QuickPanel[data-tag='" + inTag + "']").remove();
}

// Creates an empty panel.  Returns the element to be filled.  inOptions to set width and height, else default
function QuickPanel(inCaption, inElement, inOptions)
{

    var sHtml = "<div class='wv_QuickPanel' ";
    if (inOptions && inOptions.tag) {
        CloseQuickPanel(inOptions.tag);
        sHtml += " data-tag='" + inOptions.tag + "' ";
    }
    sHtml += "><br><br>";
    sHtml += "<div class='wv_QuickPanel_Caption'><center><b>" + inCaption + "</b></center></div>";
    sHtml += "<img style='position:absolute;right:4px;top:4px;cursor:pointer;height:24px' id='id_quickdialog_close' src='/static/images/close_red.png' title='Loka'/>";
    sHtml += "<div id='id_quickpanel_element' style='overflow: auto'></div>";
    sHtml += "</div>";
    var eDlg = $(sHtml);
    //    $(inElement).after(eHtml);
    var eDlg = $(sHtml).appendTo("body");
    eDlg.css("z-index", getQuickZIndex(inElement));

    if (inOptions && inOptions.height)
        $(eDlg).css("height", inOptions.height);
    if (inOptions && inOptions.width)
        $(eDlg).css("width", inOptions.width);


    // Fix position
    var offset = $(inElement).offset();
    if (offset) {
        var x = offset.left;
        var y = offset.top - eDlg.outerHeight();
        if (y < window.pageYOffset) {
            y = offset.top + $(inElement).outerHeight();
        }
        if (x + eDlg.outerWidth() > $("body").width())
            x = $("body").width() - eDlg.outerWidth();
        eDlg.css("left", x + 'px').css("top", y + "px");
    }
    else
    {
        eDlg.css("left", "50px").css("top", "50px");
    }


    if (inOptions && inOptions.left)
        $(eDlg).css("left", inOptions.left);
    if (inOptions && inOptions.right)
        $(eDlg).css("right", inOptions.right);
    if (inOptions && inOptions.top)
        $(eDlg).css("top", inOptions.top);
    if (inOptions && inOptions.minWidth)
        $(eDlg).css("min-width", inOptions.minWidth);
    if (inOptions && inOptions.maxHeight)
        $(eDlg).find("#id_quickpanel_element").css("max-height", inOptions.maxHeight);
    else
        $(eDlg).find("#id_quickpanel_element").css("max-height", "2000px");
    if (inOptions && inOptions.fontSize)
        $(eDlg).css("font-size", inOptions.fontSize);
    if (inOptions && inOptions.backgroundColor)
        $(eDlg).css("background-color", inOptions.backgroundColor);


    if (inOptions && inOptions.draggable)
        $(eDlg).draggable({ handle: '.wv_QuickPanel_Caption' });

    


    $(eDlg).find("#id_quickdialog_close").off().on("click", function () {
        if (eDlg.attr("data-tag"))
            CloseQuickPanel(eDlg.attr("data-tag"));
        else
            CloseQuickPanel();
    })
    $(eDlg).show();

    return eDlg.find("#id_quickpanel_element");
}


function CloseQuickSelect()
{
    $(".wv_QuickSelect").remove();
}

// Generates a quick selection popup.  Positioned near the inElement with the given caption.
// inTexts is an array of {Value, Folder, Caption, [Detail]}
// inCallback takes a single argument which is the selection made
function QuickSelect(inElement, inCaption, inData, inCallback)
{
    CloseQuickSelect();

    var sHtml = "<div class='wv_QuickSelect'><div style='clear:both'></div><div style='float:left;display:inline-block;border-bottom:1px solid silver;margin-bottom:8px;'>" + inCaption + "</div>";
    sHtml += "<img style='float:right;cursor:pointer;margin-left:16px;height:24px' id='id_quickdialog_close' src='/static/images/close_red.png' title='Loka'/>";
    sHtml += "<div style='clear:both'/>";
    sHtml += "</div>";
    var eDlg = $(sHtml).appendTo("body");
    eDlg.css("z-index", getQuickZIndex(inElement));


    // Append folders and items
    let sLastFolder = "";
    let eLastFolder = eDlg;
    $(inData).each(function (index, item) {
        if (item.Caption == '-') {
            $(eLastFolder).append("<hr>");
            return;
        }
        if (item.Folder && item.Folder != sLastFolder)
            eLastFolder = $("<div class='wv_QuickSelect_Folder' data-value='" + item.Value + "'><span class='wv_QuickSelect_Text'>" + item.Folder + "<span style='float:right'>&#9658;</span></span></div>").appendTo(eDlg);
        else {
            let sCaption = item.Caption;
            if (item.Checked)
                sCaption = "&#x2714;&nbsp;" + sCaption;
            $(eLastFolder).append("<div class='wv_QuickSelect_Item' data-value='" + item.Value + "' data-caption='" + item.Caption + "'><span class='wv_QuickSelect_Text'>" + sCaption + "</span></div>");
        }
        sLastFolder = item.Folder;
    });
    $(eDlg).find(".wv_QuickSelect_Folder >.wv_QuickSelect_Item").hide();

    // Fix position
    var offset = $(inElement).offset();
    if (offset) {
        var x = offset.left;
        var y = offset.top - eDlg.outerHeight();
        if (y < window.pageYOffset) {
            y = offset.top + $(inElement).outerHeight();
        }
        if (x + $(eDlg).outerWidth() > $("body").width())
            x = $("body").width() - $(eDlg).outerWidth();
        $(eDlg).css("left", x + 'px').css("top", y + "px");
    }
    else
    {
        $(eDlg).css("left", "50px").css("top", "50px");
    }
//    $(eDlg).css("max-height", "300px");
    $(eDlg).show();


    // Bind handlers
    $(eDlg).find(".wv_QuickSelect_Item").on("click", function () {
        let sValue = $(this).attr("data-value");
        let sCaption = $(this).attr("data-caption");
        CloseQuickSelect();
        (inCallback)(sValue, sCaption);
    });

    $(eDlg).find(".wv_QuickSelect_Folder").on("click", function () {
        $(eDlg).find(".wv_QuickSelect_Folder >.wv_QuickSelect_Item").hide();
        $(this).find(".wv_QuickSelect_Item").show();
    });


    $(eDlg).find("#id_quickdialog_close").off().on("click", function () {
        CloseQuickSelect();
    })

}

// Gets the calculated z-index
function getQuickZIndex(inElement)
{
    let eElement = inElement;
    while (eElement && eElement.parent().length > 0 && eElement.css('z-index') == 'auto')
    {
        eElement = eElement.parent();
    }
    if (eElement && eElement.parent().length > 0)
        return eElement.css('z-index') + 1;
    else
        return 1500;
}

// Close the quick dialog
function CloseQuickDialog()
{
    $(".wv_QuickDialog").remove();
}

// Generates a form panel for the given object
// inElement, position near this element
// inOptions, [Caption,SaveCaption,CancelCaption,AutoWidth]
// inObject, the values
// inLabels, property id  in inObject {id, Caption, Persistent, PropertyType [Text, String, Boolean, DateTime, Date, List, Table, Select(a;b;c;d;)]}
// Required includes:  caret.js, jquery-ui-timepicker-addon
function QuickDialog(inElement, inOptions, inObject, inLabels, inCallback) {
    $(".wv_QuickDialog").remove();

    var sHtml = "<div class='wv_QuickDialog'>";
    sHtml += "<img style='position:absolute;right:4px;top:4px;cursor:pointer;height:24px' id='id_quickdialog_close' src='/static/images/close_red.png' title='Loka'>";
    if (inOptions.Caption)
        sHtml += "<div class='wv_QuickDialog_Header'>" + inOptions.Caption + "</div>";

    // Add properties
    var sFirstEdit = "";
    for (var i = 0; i < inLabels.length; i++) {
        var l = inLabels[i];
        var v = inObject[l.id];
        var h = l.Help ? l.Help : "";
        if (l.Caption && l.PropertyType != 'Button')
            sHtml += "<div class='wv_QuickDialog_Caption'>" + l.Caption + "</div>";
        if (l.PropertyType == "Text") {
            if (!sFirstEdit)
                sFirstEdit = l.id;
            let sRows = l.rows;
            if (!sRows)
                sRows = 4;
            let sMaxLength = l.maxlength;
            if (!sMaxLength)
                sMaxLength = 255;
            sHtml += "<textarea data-type='Text' maxlength='" + sMaxLength + "' title='" + h + "' data-id='" + l.id + "' cols='1' rows='" + sRows + "' style='width: 90%'>" + v + "</textarea>";
        }
        else if (l.PropertyType == "String") {
            if (!sFirstEdit)
                sFirstEdit = l.id;
            sHtml += "<input data-type='String' type='text' style='width:90%' maxlength='120' title='" + h + "' data-id='" + l.id + "' value='" + v + "'/>";
        }
        else if (l.PropertyType == "Boolean") {
            if (l.Persistent)
                v = GetPersistentBool(l.id, (v ? true : false));
            sHtml += "<input data-type='Boolean' type='checkbox' data-id='" + l.id + "' title='" + h + "' data-persistent='" + (l.Persistent ? "1" : "0") + "' " + (v ? "checked" : "") + "/>";
        }
        else if (l.PropertyType == "DateTime")
            sHtml += "<input type='text' id='" + l.id + "' title='" + h + "' style='width:90%' data-type='DateTime' data-id='" + l.id + "' value='" + v + "'/>";
        else if (l.PropertyType == "Date")
            sHtml += "<input type='text' id='" + l.id + "' title='" + h + "' style='width:90%' data-type='Date' data-id='" + l.id + "' value='" + v + "'/>";
        else if (l.PropertyType == "Date_bootstrap")
            sHtml += "<input type='text' id='" + l.id + "' title='" + h + "' style='width:90%' data-type='Date' data-id='" + l.id + "' value='" + v + "'/>";

        else if (l.PropertyType == "Label")
            sHtml += "<div class='wv_QuickDialog_Label' title='" + h + "' data-type='Label' data-id='" + l.id + "'>" + v + "</div>";
        else if (l.PropertyType == "List") {
            var aText = v.split(";");
            sHtml += "<ul>";
            for (var iIndex = 0; iIndex < aText.length; iIndex++) {
                if (aText[iIndex])
                    sHtml += "<li>" + aText[iIndex] + "</li>";
            }
            sHtml += "</li>";
        }
        else if (l.PropertyType == "Table") {
            sHtml += "<table><thead><tr><th></th><th></th></tr><tbody>";
            for (var iIndex = 0; iIndex < v.length; iIndex++) {
                if (v[iIndex]) {
                    sHtml += "<tr><td>" + v[iIndex].key + "</td>";
                    sHtml += "<td>" + v[iIndex].value + "</td></tr>";
                }
            }
            sHtml += "</tbody></table>";
        }
        else if (l.PropertyType == "Select") {
            if (!sFirstEdit)
                sFirstEdit = l.id;
            var aText;
            var aValue;
            if (l.ValueData) {
                aText = l.TextData;
                aValue = l.ValueData;
            }
            else {
                aText = l.Texts.split(";");
                aValue = l.Values.split(";");
            }
            sHtml += "<select data-type='Select' title='" + h + "' data-id='" + l.id + "'>";
            var bOptGroup = false;
            for (var iIndex = 0; iIndex < aText.length; iIndex++) {
                if (aText[iIndex] == "*") {
                    if (bOptGroup)
                        sHtml += "</optgroup>";
                    sHtml += "<optgroup label='" + aValue[iIndex] + "'>"
                    bOptGroup = true;
                }
                else {
                    if (aValue[iIndex] == v)
                        sHtml += "<option value='" + aValue[iIndex] + "' selected>" + aText[iIndex] + "</option>";
                    else
                        sHtml += "<option value='" + aValue[iIndex] + "'>" + aText[iIndex] + "</option>";
                }
            }
            if (bOptGroup)
                sHtml += "</optgroup>";
            sHtml += "</select>";
        }
        else if (l.PropertyType == "Container")
            sHtml += "<div class='wv_QuickDialog_Container' data-type='Container' data-id='" + l.id + "'>" + v + "</div>";

        else if (l.PropertyType == "Radio") {
            var aText;
            var aValue;
            if (l.ValueData) {
                aText = l.TextData;
                aValue = l.ValueData;
            }
            else {
                aText = l.Texts.split(";");
                aValue = l.Values.split(";");
            }
            sHtml += "<div data-type='Radio' data-id='" + l.id + "'>";
            for (var iIndex = 0; iIndex < aText.length; iIndex++) {
                let radioID = l.id + "_" + iIndex;
                sHtml += "<input type='radio' name='" + l.id + "' title='" + h + "' style='margin-right:4px;' id='" + radioID + "' value='" + aValue[iIndex] + "'";
                if (aValue[iIndex] == v)
                    sHtml += " checked='checked'";
                sHtml += "'/>";
                sHtml += "<label for='" + radioID + "' style='padding-right: 14px;'>" + aText[iIndex] + "</label>"
            }
            sHtml += "</div>"
        }
        else if (l.PropertyType == "Button") {
            sHtml += "<div class='wv_FlatButton wv_QuickDialog_Button' data-type='Button' data-id='" + l.id + "'>" + l.Caption + "</div>";
        }
    }

    sHtml += "<p/>";

    if (!inOptions.NoSaveCaption)
        sHtml += "<div id='id_quick_ok' style='float:left;width:40%' class='wv_FlatButton'>" + (inOptions.SaveCaption ? inOptions.SaveCaption : "Vista") + "</div>";
    if (!inOptions.NoCancelCaption)
        sHtml += "<div id='id_quick_cancel' style='float:right;width:40%'  class='wv_FlatButton'>" + (inOptions.CancelCaption ? inOptions.CancelCaption : "Loka") + "</div>";
    sHtml += "</div>";

    var eDlg = $(sHtml).appendTo("body");
    eDlg.css("z-index", getQuickZIndex(inElement));


    // Fix position
    var offset = $(inElement).offset();
    var x = offset.left;
    var y = offset.top - eDlg.outerHeight();
    if (y < window.pageYOffset) {
        y = offset.top + $(inElement).outerHeight();
    }
    if (x + eDlg.outerWidth() > $("body").width())
        x = $("body").width() - eDlg.outerWidth();
    eDlg.css("left", x + 'px').css("top", y + "px");

    if (inOptions.AutoWidth)
        eDlg.css("max-width", "none");
    if (inOptions && inOptions.fontSize)
        $(eDlg).css("font-size", inOptions.fontSize);
    if (inOptions && inOptions.minWidth)
        $(eDlg).css("min-width", inOptions.minWidth);
    if (inOptions && inOptions.draggable)
        $(eDlg).draggable({ handle: '.wv_QuickDialog_Header' });



    eDlg.show();

    // Set initial focus
    if (sFirstEdit)
        $(eDlg).find("[data-id='" + sFirstEdit + "']").focus();

    if (inOptions && inOptions.focusElement)
        $(eDlg).find("[data-id='" + inOptions.focusElement + "']").focus();

    // Handlers
    for (var i = 0; i < inLabels.length; i++) {
        var l = inLabels[i];
        var v = inObject[l.id];
        if (l.PropertyType == "DateTime") {
            let eDateTimeInput = $("#" + l.id);
            $(eDateTimeInput).datetimepicker({
                firstDay: 1,
                currentText: 'Núna', closeText: 'Velja', dateFormat: 'dd.mm.yy', onClose: function () {
                }
            });
        }
        else if (l.PropertyType == "Date") {
            let eDateInput = $("#" + l.id);
            $(eDateInput).datepicker({
                firstDay: 1,
                currentText: 'Núna', closeText: 'Velja', dateFormat: 'dd.mm.yy', onClose: function () {
                }
            });
        } else if (l.PropertyType == "Date_bootstrap") {
            let eDateBootstrapInput = $("#" + l.id);
            $(eDateBootstrapInput).datepicker({
                format: 'dd.mm.yy',
                language: 'is',
                autoclose: true,
                todayHighlight: true
            });
        }

    }



    // Button handlers
    eDlg.find(".wv_QuickDialog_Button").off().on("click", function () {
        $(this).attr("data-wasclicked", "1");
        eDlg.find("#id_quick_ok").trigger("click");
        $(this).attr("data-wasclicked", "0");
    });

    // OK Handler
    eDlg.find("#id_quick_ok").off().on("click", function () {
        // Fetch values
        var eValues = eDlg.find("[data-id]");
        $(eValues).each(function (iIndex, obj) {
            var sID = $(obj).attr("data-id");
            if ($(obj).attr("data-type") == "Boolean") {
                inObject[sID] = $(obj).is(":checked");
                if ($(obj).attr("data-persistent"))
                    SetPersistentBool($(obj).attr("data-id"), inObject[sID]);
            }
            else if ($(obj).attr("data-type") == "Button")
                inObject[sID] = $(obj).attr("data-wasclicked") == "1";
            else if ($(obj).attr("data-type") == "List")
                inObject[sID] = "";
            else if ($(obj).attr("data-type") == "Table")
                inObject[sID] = "";
            else if ($(obj).attr("data-type") == "Radio")
                inObject[sID] = $("input[name='" + sID + "']:checked").val();
            else
                inObject[sID] = $(obj).val();
        });
        let oReturn = inCallback(inObject);
        if (oReturn == false)
            return;
        if (oReturn && oReturn != true)
        {
            alert(oReturn)
            return;
        }
        eDlg.hide();
    });

    eDlg.find("#id_quick_cancel, #id_quickdialog_close").off().on("click", function () {
        eDlg.hide();
    })
    eDlg.show();

    // Select2 if list is too long
    let aSelect = eDlg.find("select");
    $(aSelect).each(function (index, item) {
        if ($(item).find("option").length > 50)
            $(item).select2({ dropdownAutoWidth: true });
    });
}


// Handlers for supporting Employee,Patient list in the quick dialog
function closeQuickDialogList() {
    $(".wv_ChatUsernamePopup").remove();
}


// Returns a hash value for the given string
function GetHashFromString(inString)
{
    var hash = 0, i, chr;
    if (inString.length === 0) return hash;
    for (i = 0; i < inString.length; i++) {
        chr = inString.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

// Print the contents of the given div
// Add "noprint" class to elements that should not be printed
function PrintDiv(inDiv, inTitle, inSubTitle, inCSS)
{
    var elem = inDiv[0];
    var mywindow = window.open('', 'PRINT', 'height=400,width=500');

    if (!inTitle)
        mywindow.document.write('<html><head><title></title>');
    else
        mywindow.document.write('<html><head><title>' + inTitle + '</title>');
    if (inCSS)
        mywindow.document.write('<link media="all"  href="' + inCSS + '" rel="stylesheet" type="text/css"/>');
    mywindow.document.write('<style type="text/css">.noprint{display:none !important}</style>');
    mywindow.document.write('</head><body>');
    if (inTitle)
        mywindow.document.write("<h2>" + inTitle + "</h2>");
    if (inSubTitle)
        mywindow.document.write("<h3>" + inSubTitle + "</h3>");
    mywindow.document.write("" + elem.innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    setTimeout(function () {
        mywindow.print();
        mywindow.close();
    }, 500);

    return true;
}

