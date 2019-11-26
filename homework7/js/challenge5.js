console.log("here")

var imgs = $("img");
var msg = "Hover over an image below."

imgs.mouseover(function () {
    $(image).css("backgroundImage", "url('" + this.src + "')");
    $(image).text(this.alt);
});

imgs.focus(function () {
    $(image).css("backgroundImage", "url('" + this.src + "')");
    $(image).text(this.alt);
});

imgs.mouseleave(function () {
    $(image).css("backgroundImage", "url('')");
    $(image).text(msg);
});

imgs.blur(function () {
    $(image).css("backgroundImage", "url('')");
    $(image).text(msg);
});
