$("#subscribe").change(function () {
    var x = $("#emailField");
    if (this.checked) {
        console.log("Selected");
        x.css("display", "block");
    } else {
        console.log("Not selected");
        x.css("display", "none");
    }
});
