// Function to calculate and display the total sum of all outlets
function calculateTotalSum() {
    // Get values of all outlets
    var totalValue_1 = parseFloat(document.getElementById('totalValue_1').innerText);
    var totalValue_2 = parseFloat(document.getElementById('totalValue_2').innerText);
    var totalValue_3 = parseFloat(document.getElementById('totalValue_3').innerText);
    var totalValue_4 = parseFloat(document.getElementById('totalValue_4').innerText);

    // Calculate total sum
    var totalSum = totalValue_1 + totalValue_2 + totalValue_3 + totalValue_4;

    // Display total sum
    document.getElementById('totalSumValue').innerText = totalSum.toFixed(2); // Assuming 2 decimal places for precision

    // Call the function to calculate and display total energy in PESO
    totalValuePeso(totalSum);
}

// Function to calculate and display the total energy in PESO
function totalValuePeso(totalSum) {
    // Conversion rate from KWH to PESO
    var conversionRate = 11.9566; // Assume 1 KWH = 11.9566 PESO (Change this value according to updated actual conversion rate)

    // Calculate the total energy in PESO
    var totalEnergyPeso = totalSum * conversionRate;

    // Display the total energy in PESO
    document.getElementById("totalValuePeso").textContent = totalEnergyPeso.toFixed(2); // Round to 2 decimal places
}

// Call the function to calculate total sum and total energy in PESO
calculateTotalSum();

function convertKWHtoPeso() {
    // Get the input value
    var kwhInput = parseFloat(document.getElementById('kwhInput').value);

    // Conversion rate from KWH to Peso
    var conversionRate = 11.9566; // Assume 1 KWH = 10.28 Peso (Change this value according to your conversion rate)

    // Calculate the result in Peso
    var pesoResult = kwhInput * conversionRate;

    // Display the result
    document.getElementById('pesoResult').value = pesoResult.toFixed(2); // Assuming 2 decimal places for precision
}



