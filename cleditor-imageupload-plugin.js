$(document).ready(function() {

    var dlgBody = '';

    // Image button
    $.cleditor.buttons.image = {
        name: 'image',
        title: 'Insert/Upload Image',
        command: 'insertimage',
        popupName: 'image',
        popupClass: 'cleditorPrompt',
        stripIndex: $.cleditor.buttons.image.stripIndex,
        popupContent: 'Please configure imageListUrl',
        buttonClick: insertImageClick,
        uploadUrl: 'imageUpload',
        imageListUrl: 'imagesList'
    };

    function insertImageClick(e, data) {
        createDlg($.cleditor.buttons.image.imageListUrl, $.cleditor.buttons.image.uploadUrl, data);
    }

    function createDlg(imagesListUrl, uploadUrl, data) {
        var editor = data.editor;
        var popup = data.popup;
        var hiddenFrameName = '__uploadIframe';

        $.getJSON(imagesListUrl, function(jsonData) {
            // Create dialog with images list		
            dlgBody = '<div class="tabbable">' +
                    '<ul class="nav nav-tabs">' +
                    ' <li class="active"><a href="#tab1" data-toggle="tab">Images list</a></li>' +
                    ' <li><a href="#tab2" data-toggle="tab">Upload image</a></li>' +
                    '</ul>' +
                    '<div class="tab-content">' +
                    // Images list panel
                    ' <div class="tab-pane active span7" id="tab1">' +
                    '  <p>Images list</p>' +
                    '  <div style="overflow-y: auto; max-height:200px;" class="well">';

            for (var i = 0; i < jsonData.length; i++) {
                dlgBody += '<div style="width:15%; padding:5px; float:left;">' +
                        '<a href="#" id="imgBtn' + i + '" class="btn thumbnail">' +
                        '<img src="' + jsonData[i] + '" width="100"/>' +
                        '</a></div>';
            }

            dlgBody += '</div>' +
                    '</div>' +
                    // Image upload panel

                    '<div class="tab-pane span7" id="tab2">' +
                    '<iframe style="width:0;height:0;border:0;" name="' + hiddenFrameName + '" />' +
                    '<table cellpadding="5" cellspacing="0">' +
                    '<tr><td>Choose a File:</td></tr>' +
                    '<tr><td> ' +
                    '<form id="imgUploadForm" method="post" enctype="multipart/form-data" action="" target="' + hiddenFrameName + '">' +
                    '<input id="imageName" name="imageName" type="file" /></form> </td></tr>' +
                    '<tr><td>Or enter URL:</td></tr>' +
                    '<tr><td><input type="text" id="cleditorUrl" size="40" value="" /></td></tr>' +
                    '</table><input type="button" id="uploadBtn" value="Submit">' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            $(popup).html(dlgBody);

            // Insert image
            $(data.popup).find('.btn').unbind("click").bind("click", function(e) {
                e.preventDefault();
                // Insert some image into the document
                editor.execCommand(data.command, $(this).children("img").attr("src"), null, data.button);
                hidePopup(editor);
            });

            urlTextField = $(data.popup).find(':text'),
                    url = $.trim(urlTextField.val()),
                    uploadIframe = $(data.popup).find('iframe'),
                    loadedFile = $(data.popup).find(':file');

            // Cleaning of previously selected file and url
            loadedFile.val('');
            urlTextField.val('').focus();

            // Submit button click event		
            $(data.popup).find(':button').unbind("click").bind("click", function(e) {
                // User downloads the file
                var img_url = urlTextField.val();
                if (loadedFile.val()) {
                    uploadIframe.bind('load', function() {
                        var fileUrl = '';
                        try {
                            fileUrl = uploadIframe.get(0).contentWindow.document.getElementById('image').innerHTML;
                        } catch (e) {
                            console.log('Error: ' + e);
                        }
                        if (fileUrl) {
                            editor.execCommand(data.command, fileUrl, null, data.button);
                        } else {
                            alert('An error occured during upload!');
                        }
                        uploadIframe.unbind('load');
                        hidePopup(editor);
                    });
                    $(data.popup).find('form').attr('action', uploadUrl);
                    $(data.popup).find('form').submit();
                    // User puts URL
                } else if (img_url != '') {
                    if(checkImgURL(img_url)){
                        editor.execCommand(data.command, img_url, null, data.button);
                        hidePopup(editor);
                    } else {
                        alert('Please enter valid image URL');
                    }
                } else {
                    alert('Please uplod image or URL');
                }
            });

        });
    }

    function hidePopup(editor) {
        editor.hidePopups();
        editor.focus();
    }

    function checkImgURL(url) {
        return(url.match(/\.(jpeg|jpg|gif|png|bmp)$/) != null);
    }

});