/* =================================== */
/*	               main js             */
/* =================================== */

//#region on Jquery
$(document).ready(function () {
    $(this).scrollTop(0);

    //technoloy by default first tab is active
    $(".tablinks:nth-child(1)").addClass('border-b-2 border-primary text-primary');
    $(".tablinks:nth-child(1)").removeClass('border-b border-secondary_light');

    //about by default first tab is active
    $(".about-links:nth-child(1)").addClass('border-b-2 border-primary text-primary');
    $(".about-links:nth-child(1)").removeClass('border-b border-secondary_light');   

    //technology button active
    $('.tablinks').click(function () {
        $('.tablinks').removeClass('border-b-2 border-primary text-primary');
        $('.tablinks').addClass('border-b border-secondary_light');
        if ($(this).find('active')) {
            $(this).addClass('border-b-2 border-primary text-primary');
            $(this).removeClass('border-b border-secondary_light');
        }
    });

    //about button active
    $('.about-links').click(function () {
        $('.about-links').removeClass('border-b-2 border-primary text-primary');
        $('.about-links').addClass('border-b border-secondary_light');
        if ($(this).find('active')) {
            $(this).addClass('border-b-2 border-primary text-primary');
            $(this).removeClass('border-b border-secondary_light');
        }
    });

    // custom counter
    $('.counter').each(function () {
        var $this = $(this),
            countTo = $this.attr('data-count');
        $({
            countNum: $this.text()
        }).animate({
            countNum: countTo
        }, {
            duration: 4000,
            easing: 'linear',
            step: function () {
                $this.text(Math.floor(this.countNum));
            },
            complete: function () {
                $this.text(this.countNum);
            }
        });
    });
    $(".accordion-header").children(".svg").addClass("rotater")
    // accordion section 
    $("#accordions .accordion-header").on("click", function () {
        $(this).siblings().slideToggle();
        $(this).addClass("bg-secondary_dark text-white");
        $(this).children(".svg").toggleClass("forwar-rotater rotater");
        $(this).children(".checked-icon").css({
            "fill": "#FE8464"
        });
        $(this).parent().siblings().children(".accordion-body").slideUp();
        $(this).parent().siblings().children(".accordion-header").removeClass("bg-secondary_dark text-white");
        $(this).parent().siblings().children(".accordion-header").children(".svg").removeClass("forwar-rotater").addClass("rotater");
        // $(this).parent().siblings().children(".accordion-header").children(".checked-icon").css({"fill":"#FE8464"});


    });

    $('.case-stude-learn').click(function () {
        $(this).css("display", "none");
        $(this).parent().children(".ourcase-more").css("display", "block");
    })
});
//#endregion on Jquery

//#region banner animation
const DOT_RADIUS = 64; // Radius of the dots
const SCALE = 1.1; // Scale of svgs
const MIN_SPEED = 0.0007;
const MOUSE_SPEED = 0.05;

// TRANSLATE SVG ELEMENTS TO Path2D
let svgs = document.getElementById("svg-container");
let COLORS = Array(svgs.children.length);
let PATHS = [...svgs.children].map((svg, i) => {
    if (svg.children[0].tagName == "g") {
        svg = svg.children[0];
        COLORS[i] = Array(svg.children.length);
        COLORS[i][0] = svg.getAttribute("fill");
    } else {

        COLORS[i] = Array(svg.children.length);
    }
    return [...svg.children].map((e, j) => {
        let c = e.getAttribute("fill");
        if (c !== null) {
            COLORS[i][j] = c;
        } else {
            COLORS[i][j] = COLORS[i][0] ? COLORS[i][0] : "#FFF";
        }
        return new Path2D(e.getAttribute("d"));
    });

});
const SAMPLES = PATHS.length;

// BEGIN CANVAS RENDERING
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

let width = canvas.offsetWidth;
let height = canvas.offsetHeight;



let PERSPECTIVE;
let PROJECTION_CENTER_X;
let PROJECTION_CENTER_Y;
let GLOBE_RADIUS;


function onResize() {
    PERSPECTIVE = width * 0.8;
    PROJECTION_CENTER_X = width / 2;
    PROJECTION_CENTER_Y = height / 2;
    GLOBE_RADIUS = width / 4;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    if (window.devicePixelRatio > 1) {
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        ctx.scale(2, 2);
    } else {
        canvas.width = width;
        canvas.height = height;
    }
}
window.addEventListener('resize', onResize);
onResize();

let PHI = Math.PI * (3.0 - Math.sqrt(5.0));
let VX = MIN_SPEED;
let VY = MIN_SPEED;
let VZ = MIN_SPEED;
let mouse_x = 0;
let mouse_y = 0;
let mouse_moving = false;


canvas.addEventListener('mousemove', e => {
    mouse_moving = true;
    mouse_x = e.offsetX - width / 2;
    mouse_y = e.offsetY - height / 2;
    VY = MOUSE_SPEED * mouse_x / width;
    VZ = MOUSE_SPEED * mouse_y / height;

});
canvas.addEventListener("mouseout", function (event) {
    mouse_moving = false;
    let theta = -1 * Math.atan2(mouse_y - height / 2, mouse_x - width / 2) + Math.PI * 0.5;
    let setSpeedZ = Math.cos(theta) * 0.1;
    let setSpeedY = Math.sin(theta) * 0.1;
    function slowDownSpin() {
        if (mouse_moving) {
            return;
        }
        VZ /= 1.3;
        VY /= 1.3;
        if (Math.abs(VZ) <= MIN_SPEED) {
            VZ = Math.sign(VZ) * MIN_SPEED;
        }
        if (Math.abs(VY) <= MIN_SPEED) {
            VY = Math.sign(VY) * MIN_SPEED;
        }
        if ((VZ == MIN_SPEED) || (VY == MIN_SPEED)) {
            return;
        }
        setTimeout(slowDownSpin, 150);
    }
    slowDownSpin();

}, false);


class Dot {
    constructor(i, paths) {
        this.colors = COLORS[i];
        this.y = 1 - (i / (SAMPLES - 1)) * 2;
        let radius = Math.sqrt(1 - this.y * this.y);
        this.theta = PHI * i;
        this.x = Math.cos(this.theta) * radius;
        this.z = Math.sin(this.theta) * radius;
        this.paths = paths;
        this.xProjected = 0;
        this.yProjected = 0;
        this.scaleProjected = 0;

    }
    rotate() {

        let x1 = this.x * Math.cos(VX) - this.y * Math.sin(VX);
        let y1 = this.x * Math.sin(VX) + this.y * Math.cos(VX);

        let x2 = x1 * Math.cos(VY) - this.z * Math.sin(VY);
        let z2 = x1 * Math.sin(VY) + this.z * Math.cos(VY);

        let y3 = y1 * Math.cos(VZ) - z2 * Math.sin(VZ);
        let z3 = y1 * Math.sin(VZ) + z2 * Math.cos(VZ);
        this.x = x2;
        this.y = y3;
        this.z = z3;

    }

    project() {
        this.rotate();
        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z * GLOBE_RADIUS);
        this.xProjected = (this.x * GLOBE_RADIUS * this.scaleProjected) + PROJECTION_CENTER_X - DOT_RADIUS * this.scaleProjected;
        this.yProjected = (this.y * GLOBE_RADIUS * this.scaleProjected) + PROJECTION_CENTER_Y - DOT_RADIUS * this.scaleProjected;
    }
    // Draw the dot on the canvas
    draw() {
        this.project();
        ctx.save();

        ctx.globalAlpha = Math.abs(1 - this.z * 3 * GLOBE_RADIUS / width);
        ctx.beginPath();
        ctx.translate(this.xProjected, this.yProjected);
        ctx.scale(this.scaleProjected * SCALE * width / 1920, this.scaleProjected * SCALE * width / 1920);

        this.paths.forEach((path, i) => {
            ctx.fillStyle = this.colors[i];
            ctx.fill(path);
        });
        ctx.restore();
    }
}
const dots = PATHS.map((e, i) => new Dot(i, e));

function render() {
    ctx.fillStyle = "#fafafc";
    ctx.fillRect(0, 0, width, height);
    dots.sort((dot1, dot2) => {
        return dot1.scaleProjected - dot2.scaleProjected;
    });

    dots.forEach(dot => {
        dot.draw();
    });
    window.requestAnimationFrame(render);
}

function renderDark() {
    ctx.fillStyle = "#293651";
    ctx.fillRect(0, 0, width, height);
    dots.sort((dot1, dot2) => {
        return dot1.scaleProjected - dot2.scaleProjected;
    });

    dots.forEach(dot => {
        dot.draw();
    });
    window.requestAnimationFrame(renderDark);
}
render();

$('#toggle').click(function () {
    if ($('html').hasClass("dark")) {
        render();
    }
    else {
        renderDark();
    }
});
//#endregion banner animation

//#region animation on scroll library
AOS.init({
    duration: 2000,
});
//#endregion animation on scroll library

//#region Mobilemenu Navbar.
function togglebtn() {
    var dropdown = document.getElementById('toggleMenu');
    var menu = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('hidden');
    menu.classList.add('left-0');
}
//#endregion Mobilemenu Navbar.

//#region navbar color change on scoll
$(window).scroll(function () {
    if ($(this).scrollTop() > 0) {
        $('#navbarMenu').addClass('bg-white sticky top-0');
        $('#navbarMenu').removeClass('bg-light');
    } else {
        $('#navbarMenu').removeClass('bg-white sticky top-0');
        $('#navbarMenu').addClass('bg-light');
    }
});
//#endregion navbar color change on scoll

//#region navbar scroll on active
var scrollLink = $('.nav-item');
$(window).scroll(function () {
    var scrollbarLocation = $(this).scrollTop();
    scrollLink.each(function () {
        var sectionOffset = $(this.hash).offset().top - 73;
        if (sectionOffset <= scrollbarLocation) {
            $(this).parent().addClass('border-b-2 border-primary');
            $(this).parent().siblings().removeClass('border-b-2 border-primary dark:border-secondary');
        }
    });
});
//#endregion navbar scroll on active

//#region technology tabs start
function openCity(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();
//#endregion technology tabs start

//#region about tabs start

//#endregion about tabs start

//#region switch to dark mode mobile
function onchangeTheme() {
    var i;
    var checkbox = document.getElementsByClassName('toggle')
    var html = document.querySelector('html');
    for (i = 0; i < checkbox.length; i++) {
        checkbox[i].checked ?
            html.classList.add("dark") :
            html.classList.remove("dark")
    }
}

// switch to dark mode desktop
const checkbox = document.querySelector('#toggle');
const html = document.querySelector('html');

const toggleDarkMode = function () {
    checkbox.checked ?
        html.classList.add("dark") :
        html.classList.remove("dark")
}

toggleDarkMode();
checkbox.addEventListener("click", toggleDarkMode);

// onclick light and dark svg icons change
$('input[type="checkbox"]').click(function () {
    if ($(this).prop("checked") == true) {
        $(".sun-svg").css("display", "none");
        $(".moon-svg").css("display", "block");
    } else if ($(this).prop("checked") == false) {
        $(".moon-svg").css("display", "none");
        $(".sun-svg").css("display", "block");
    }
});
//#endregion switch to dark mode mobile