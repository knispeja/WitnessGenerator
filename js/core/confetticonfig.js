confetti_target = null;
confetti_config = {
    angle: 90,
    spread: 180,
    startVelocity: 45,
    elementCount: 75,
    dragFriction: 0.1,
    duration: 3500,
    stagger: 0,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

function confetti_helper() {
    if (confetti_target == null) {
        confetti_target = document.body;
    }

    confetti(confetti_target, confetti_config);
}

function set_give_up_confetti() {
    confetti_target = document.getElementById("give_up_target");
    confetti_config = {
        angle: 0,
        spread: 90,
        startVelocity: 20,
        elementCount: 25,
        dragFriction: 0.2,
        duration: 7500,
        stagger: 100,
        width: "15px",
        height: "15px",
        colors: ["#2d1608", "#1a1110", "#625d2a"]
    };
}