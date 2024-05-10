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

// Function to send toggle command to Raspberry Pi
function toggleRelay(relayIndex, isChecked) {
    var action = isChecked ? 'on' : 'off';
    var message = relayIndex + '_' + action;
    sendCommand(message); // Corrected from 'command' to 'message'
}

function sendCommand(command) {
    var clientId = "web_" + parseInt(Math.random() * 100, 10);
    var mqttClient = new Paho.MQTT.Client("b27bec4b3b9742fcb4c22ea1c1262d7c.s1.eu.hivemq.cloud", 8884, clientId);

    mqttClient.onConnectionLost = function (responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("Connection lost:", responseObject.errorMessage);
        }
    };

    var options = {
        useSSL: true,
        userName: 'emsbot', // Replace with your MQTT username
        password: 'Rioja@12345', // Replace with your MQTT password
        onSuccess: function() {
            console.log("Connected to MQTT broker");
            var message = new Paho.MQTT.Message(command);
            message.destinationName = "raspberrypi/relay";
            mqttClient.send(message);
            mqttClient.disconnect();
        },
        onFailure: function(error) {
            console.error("Failed to connect to MQTT broker:", error.errorMessage);
        }
    };

    mqttClient.connect(options);
}