document.getElementById('upgrade-stash-button').addEventListener('touchstart', () => {
    document.getElementById('upgrade-stash-button').style.backgroundImage = `url('client/assets/design/stash_button_upgrade_pressed.png')`
});

document.getElementById('upgrade-stash-button').addEventListener('touchend', () => {
    document.getElementById('upgrade-stash-button').style.backgroundImage = "url('client/assets/design/stash_button_upgrade.png')";
});


document.getElementById('closeStash').addEventListener('touchstart', () => {
    document.getElementById('closeStash').style.backgroundImage = `url('client/assets/design/button_exit_pressed.png')`
});

document.getElementById('closeStash').addEventListener('touchend', () => {
    document.getElementById('closeStash').style.backgroundImage = "url('client/assets/design/button_exit.png')";
});

document.getElementById('closeOrders').addEventListener('touchstart', () => {
    document.getElementById('closeOrders').style.backgroundImage = `url('client/assets/design/button_exit_pressed.png')`
});

document.getElementById('closeOrders').addEventListener('touchend', () => {
    document.getElementById('closeOrders').style.backgroundImage = "url('client/assets/design/button_exit.png')";
});

document.querySelectorAll('.buildable-close-button').forEach(button => {
    button.addEventListener('touchstart', () => {
        button.style.backgroundImage = `url('client/assets/design/button_exit_pressed.png')`;
    });

    button.addEventListener('touchend', () => {
        button.style.backgroundImage = "url('client/assets/design/button_exit.png')";
    });
});

document.querySelectorAll('.buildable-close-button').forEach(button => {
    button.addEventListener('touchstart', () => {
        button.style.backgroundImage = `url('client/assets/design/button_exit_pressed.png')`;
    });

    button.addEventListener('touchend', () => {
        button.style.backgroundImage = "url('client/assets/design/button_exit.png')";
    });
});

document.querySelectorAll('.exit_button_metal').forEach(button => {
    button.addEventListener('touchstart', () => {
        button.style.backgroundImage = `url('client/assets/design/exit_button_metal_2.png')`;
    });

    button.addEventListener('touchend', () => {
        button.style.backgroundImage = "url('client/assets/design/exit_button_metal_1.png')";
    });
});