function interact() {
    let play = createButton("play");
    play.mouseClicked(() => {
        playing = !playing;
        if (playing) {
            time = millis();
            play.html("pause");
        } else {
            play.html("play");
        }
    });
    play.position(0, 0);
    play.style("backgroundColor", "red");

    
    let selectedColor = "rgb(151, 104, 240)";
    let normalColor = "rgb(122, 60, 240)";
    let position = createButton("position");
    position.mouseClicked(() => {
        selected = 1;
        colorAccordingly();
    });
    position.position(80, height-25);
    position.style("backgroundColor", selectedColor);

    let velocity = createButton("velocity");
    velocity.mouseClicked(() => {
        selected = 2;
        colorAccordingly();
    });
    velocity.position(160, height-25);
    velocity.style("backgroundColor", normalColor);

    let starMass = createButton("star mass");
    starMass.mouseClicked(() => {
        selected = 3;
        colorAccordingly();
    });
    starMass.position(240, height-25);
    starMass.style("backgroundColor", normalColor);

    let reset = createButton("reset");
    reset.mouseClicked(() => {
        resetting = !resetting;
        if (resetting) {
            reset.html("done");
            position.style("display", "block");
            velocity.style("display", "block");
            starMass.style("display", "block");
        } else {
            reset.html("reset");
            position.style("display", "none");
            velocity.style("display", "none");
            starMass.style("display", "none");
        }
    });
    position.style("display", "none");
    velocity.style("display", "none");
    starMass.style("display", "none");
    reset.position(0, height-25);
    reset.style("backgroundColor", "rgb(190, 42, 245)");
    function colorAccordingly() {
        if (selected == 1) {
            position.style("backgroundColor", selectedColor);
        } else {
            position.style("backgroundColor", normalColor);
        }
        if (selected == 2) {
            velocity.style("backgroundColor", selectedColor);
        } else {
            velocity.style("backgroundColor", normalColor);
        }if (selected == 3) {
            starMass.style("backgroundColor", selectedColor);
        } else {
            starMass.style("backgroundColor", normalColor);
        }
    }
    let spaceColor = "rgba(50, 50, 200, 0.25)";
    let timeColor = "rgba(200, 50, 50, 0.25)";
    let spaceTime = createButton("space");
    function manageTime(sec) {
        let hours = sec / 3600;
        let days = sec / 86400;
        let months = sec / 2592000;
        let years = sec / 31557600;
        if (years >= 1) {
            return `${years.toPrecision(3)} years`;
        } else if (months >= 1) {
            return `${months.toPrecision(3)} months`;
        } else if (days >= 1) {
            return `${days.toPrecision(3)} days`;
        } else if (hours >= 1) {
            return `${hours.toPrecision(3)} hours`;
        } else {
            return `${sec.toPrecision(3)} secs`;
        }
    }
    spaceTime.mouseClicked(() => {
        if (spaceTime.html() == "space") {
            spaceTime.html("time");
            zoomOut.html("x.83");
            zoomIn.html("x1.2");
            spaceScale.html(`1 sec represents ${manageTime(tscale*1000)}`);
            spaceTime.style("backgroundColor", timeColor);
            zoomOut.style("backgroundColor", timeColor);
            zoomIn.style("backgroundColor", timeColor);
            spaceScale.style("backgroundColor", timeColor);
        } else {
            spaceTime.html("space");
            zoomOut.html("-");
            zoomIn.html("+");
            spaceScale.html(`this box is ${(sscale*150).toPrecision(3).toString()} meters wide`);
            spaceTime.style("backgroundColor", spaceColor);
            zoomOut.style("backgroundColor", spaceColor);
            zoomIn.style("backgroundColor", spaceColor);
            spaceScale.style("backgroundColor", spaceColor);
        }
    })
    spaceTime.position((width * 2 / 3) - 120, height - 47);
    spaceTime.style("backgroundColor", spaceColor);
    spaceTime.style("font-size", "14px");

    let spaceScale = createDiv(`this box is ${(sscale*150).toPrecision(3).toString()} meters wide`);
    spaceScale.id("scale");
    spaceScale.style("width", "150px");
    spaceScale.style("padding", "5px 0 4px 0");
    spaceScale.position((width * 2 / 3) - 271, height - 47);
    spaceScale.style("textAlign", "center");
    spaceScale.style("backgroundColor", spaceColor);
    spaceScale.style("color", "rgba(255, 255, 255, 0.5)");

    let zoomOut = createButton("-");
    zoomOut.mouseClicked(() => {
        if (spaceTime.html() == "space") {
            sscale *= 1.2;
            vscale = sscale / tscale;
            spaceScale.html(`this box is ${(sscale*150).toPrecision(3).toString()} meters wide`);
        } else {
            tscale /= 1.2;
            vscale = sscale / tscale;
            spaceScale.html(`1 sec represents ${manageTime(tscale*1000)}`);
        }
    });
    zoomOut.position((width * 2 / 3) - 120, height-25);
    zoomOut.style("width", "40px");
    zoomOut.style("backgroundColor", spaceColor);
    let zoomIn = createButton("+");
    zoomIn.mouseClicked(() => {
        if (spaceTime.html() == "space") {
            sscale /= 1.2;
            vscale = sscale / tscale;
            spaceScale.html(`this box is ${(sscale*150).toPrecision(3).toString()} meters wide`);
        } else {
            tscale *= 1.2;
            vscale = sscale / tscale;
            spaceScale.html(`1 sec represents ${manageTime(tscale*1000)}`);
        }
    });
    zoomIn.position((width*2/3) - 79, height-25);
    zoomIn.style("width", "40px");
    zoomIn.style("backgroundColor", spaceColor);
}

