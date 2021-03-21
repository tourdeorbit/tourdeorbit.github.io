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
}

