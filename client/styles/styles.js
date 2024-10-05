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