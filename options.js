// Saves options to chrome.storage
function save_options() {
    var disableSnow = document.getElementById('disableSnow').checked;
    var disableAllAnimations = document.getElementById('disableAllAnimations').checked;
    chrome.storage.sync.set({
        snowDisabled: disableSnow,
        allAnimationsDisabled: disableAllAnimations
    }, function () {
        // Update status to let user know options were saved.
        const status = document.createElement('div');
        status.textContent = 'Options saved.';
        status.style.marginTop = '10px';
        status.style.color = 'green';
        document.body.appendChild(status);
        setTimeout(function () {
            status.remove();
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        snowDisabled: false,
        allAnimationsDisabled: false
    }, function (items) {
        document.getElementById('disableSnow').checked = items.snowDisabled;
        document.getElementById('disableAllAnimations').checked = items.allAnimationsDisabled;

        const now = new Date();
        const month = now.getMonth(); // 0 = Jan, 11 = Dec
        const snowOptionContainer = document.getElementById('snowOptionContainer');

        // Show snow option only in December (11), January (0), and February (1)
        if (month === 11 || month === 0 || month === 1) {
            snowOptionContainer.style.display = 'block';
        } else {
            snowOptionContainer.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('disableSnow').addEventListener('change', save_options);
document.getElementById('disableAllAnimations').addEventListener('change', save_options);
