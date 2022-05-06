$(document).ready(function(){

    var clientId = "515079049164-5tvhqducbao96ktck7qsoouv1ic95jg7.apps.googleusercontent.com";

    var redirectURI = "https://localhost/GoogleDrive/upload.html";

    var projectScope = "https://www.googleapis.com/auth/drive";

    var address = "";


    //event click listener to the login button
    $("#login").click(function(){
       login(clientId,redirectURI,projectScope,address);

    });

    function login(clientId,redirectURI,projectScope,address){

      //url the user will directed after sign in
       address = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirectURI
       +"&prompt=consent&response_type=code&client_id="+clientId+"&scope="+projectScope
       +"&access_type=offline";

       window.location = address;

    }



});
