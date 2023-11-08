// ---------Responsive-navbar-active-animation-----------
function test() {
    var tabsNewAnim = $("#navbarSupportedContent");
    var selectorNewAnim = $("#navbarSupportedContent").find("li").length;
    var activeItemNewAnim = tabsNewAnim.find(".active");
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
        top: itemPosNewAnimTop.top + "px",
        left: itemPosNewAnimLeft.left + "px",
        height: activeWidthNewAnimHeight + "px",
        width: activeWidthNewAnimWidth + "px"
    });
    $("#navbarSupportedContent").on("click", "li", function (e) {
        $("#navbarSupportedContent ul li").removeClass("active");
        $(this).addClass("active");
        var activeWidthNewAnimHeight = $(this).innerHeight();
        var activeWidthNewAnimWidth = $(this).innerWidth();
        var itemPosNewAnimTop = $(this).position();
        var itemPosNewAnimLeft = $(this).position();
        $(".hori-selector").css({
            top: itemPosNewAnimTop.top + "px",
            left: itemPosNewAnimLeft.left + "px",
            height: activeWidthNewAnimHeight + "px",
            width: activeWidthNewAnimWidth + "px"
        });
    });
}
$(document).ready(function () {
    setTimeout(function () {
        test();
    });
});
$(window).on("resize", function () {
    setTimeout(function () {
        test();
    }, 500);
});
$(".navbar-toggler").click(function () {
    $(".navbar-collapse").slideToggle(300);
    setTimeout(function () {
        test();
    });
});


function runSpinner() {
    document.querySelector(".simple-spinner").classList.remove("d-none")
    setInterval(() => {
        document.querySelector(".simple-spinner").classList.add("d-none")
    }, 5000)

}

/**
 * @constructor
 * @param {string} string 
 * @returns 
 */
function capitalize(string){
    
    return string.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())

}

/**
 * @constructor
 * @param {string} string 
 * @returns 
 */
function numberRoman(string){
    return string.replaceAll("Ii","II").replaceAll("Iii","III").replaceAll("IIig","IIIG").replaceAll("IIig-i","IIIG-I").replaceAll("IIih-i","IIIH-I")
    .replaceAll("IIil","IIIL").replaceAll("IIin","IIIN").replaceAll("IIi-i","III-I").replaceAll("IIij","IIIJ").replaceAll("IIi","III").replaceAll("IIIG-i","IIIG-I")
}