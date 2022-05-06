$(document).ready(function(){


    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirectURI = "https://localhost/GoogleDrive/upload.html"
    //CLient secret code from GOOGLE API console

    const clientSecret = "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";
    const scope = "https://www.googleapis.com/auth/drive";
    var access_token= "";
    //CLient ID from GOOGLE API console
    var clientId = "515079049164-5tvhqducbao96ktck7qsoouv1ic95jg7.apps.googleusercontent.com";

    //ajax POST request return type JSON (NOT XML)
    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {
            code:code,
            redirect_uri:redirectURI,
            client_secret:clientSecret,
            client_id:clientId,
            scope:scope,
            grant_type:"authorization_code"
        },
        dataType: "json",
        success: function(resultData) {

            //Using javascript localStorage methood to save the access token in local storage
           localStorage.setItem("accessToken",resultData.access_token);
           localStorage.setItem("refreshToken",resultData.refreshToken);
           localStorage.setItem("expires_in",resultData.expires_in);
           window.history.pushState({}, document.title, "/GoogleDrive/" + "upload.html");

        }

  });
    //Cleaning URL
    function stripQueryStringAndHashFromPath(url) {
        return url.split("?")[0].split("#")[0];
    }

    var Upload = function (file) {
        this.file = file;
    };

    Upload.prototype.getType = function() {
        localStorage.setItem("type",this.file.type);
        return this.file.type;
    };
    Upload.prototype.getSize = function() {
        localStorage.setItem("size",this.file.size);
        return this.file.size;
    };
    Upload.prototype.getName = function() {
        return this.file.name;
    };

    // upload the files to google drive using google API service
    Upload.prototype.doUpload = function () {
        var that = this;
        var formData = new FormData();

        formData.append("file", this.file, this.getName());
        formData.append("upload_file", true);

        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));

            },
            url: "https://www.googleapis.com/upload/drive/v2/files",
            data:{
                uploadType:"media"
            },
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', that.progressHandling, false);
                }
                return myXhr;
            },
            success: function (data) {
                console.log(data);
            },
            error: function(error) {
                console.log(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };
    //Upload progress indicator function
    Upload.prototype.progressHandling = function (event) {
        var percentage = 0;
        var position = event.loaded || event.position;
        var total = event.total;
        var progressBarId = "#progress-wrp";
        if (event.lengthComputable) {
            percentage = Math.ceil(position / total * 100);
        }

        $(progressBarId + " .progress-bar").css("width", +percentage + "%");
        $(progressBarId + " .status").text(percentage + "%");
    };

    $("#uploadFile").on("click", function (e) {
        var file = $("#files")[0].files[0];
        var upload = new Upload(file);

        upload.doUpload();
    });




});
