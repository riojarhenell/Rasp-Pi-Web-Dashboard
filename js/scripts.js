/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

const rateInput = document.getElementById('ratePerKWhInput');

// Assuming each outlet has a unique ID for the total value and result display
const outletData = [
    { totalValueId: 'totalValue_1', resultDisplayId: 'resultDisplay_1' },
    { totalValueId: 'totalValue_2', resultDisplayId: 'resultDisplay_2' },
    { totalValueId: 'totalValue_3', resultDisplayId: 'resultDisplay_3' },
    { totalValueId: 'totalValue_4', resultDisplayId: 'resultDisplay_4' }
];

// Function to update the multiplied value when the input changes
rateInput.addEventListener('input', function() {
    const ratePerKWh = parseFloat(rateInput.value); // Get the entered rate per kWh as a number
    
    if (!isNaN(ratePerKWh)) {
        outletData.forEach(outlet => {
            const totalValueElement = document.getElementById(outlet.totalValueId);
            const resultDisplay = document.getElementById(outlet.resultDisplayId);

            if (totalValueElement && resultDisplay) {
                const totalValue = parseFloat(totalValueElement.textContent); // Get the total value as a number
                
                if (!isNaN(totalValue)) {
                    const multipliedValue = ratePerKWh * totalValue; // Perform multiplication
                    resultDisplay.textContent = multipliedValue.toFixed(2); // Display the multiplied value with two decimal places
                } else {
                    resultDisplay.textContent = '0.00'; // Display default value if total value is invalid
                }
            }
        });
    }
});

var socket = new WebSocket('ws://emsbot.me:8000');

        // Function to send toggle command to Raspberry Pi
        function toggleRelay(relayIndex, isChecked) {
            var action = isChecked ? 'on' : 'off';
            var message = relayIndex + '_' + action;
            socket.send(message);
        }