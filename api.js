// Prevent default behavior of dropdown menu items
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default behavior (scrolling up)
        // Your code to handle the selection goes here
        // For example, you can retrieve the selected data-type and data-label attributes and perform any necessary actions
    });
});

let API_KEY = 'AIzaSyClFZN9QIepoB0wnb4LAX9OZyvkn-oNcWU';
let SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ';

// Function to fetch data from Google Sheets
function fetchData(sheetName, range, targetElementId, apiKey, spreadsheetId) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}${range}?key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const value = data.values[0][0];
            document.getElementById(targetElementId).textContent = value;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Define an array of queries with sheet name, range, and target element ID
const queries = [
    { sheet: 'Query 1', range: ['!C4:C4', '!D4:D4', '!E4:E4', '!G4:G4', '!H4:H4', '!I4:I4'], targets: ['voltageValue_1', 'currentValue_1', 'powerValue_1', 'wattValue_1', 'kwhValue_1', 'totalValue_1'] },
    { sheet: 'Query 2', range: ['!C4:C4', '!D4:D4', '!E4:E4', '!G4:G4', '!H4:H4', '!I4:I4'], targets: ['voltageValue_2', 'currentValue_2', 'powerValue_2', 'wattValue_2', 'kwhValue_2', 'totalValue_2'] },
    { sheet: 'Query 3', range: ['!C4:C4', '!D4:D4', '!E4:E4', '!G4:G4', '!H4:H4', '!I4:I4'], targets: ['voltageValue_3', 'currentValue_3', 'powerValue_3', 'wattValue_3', 'kwhValue_3', 'totalValue_3'] },
    { sheet: 'Query 4', range: ['!C4:C4', '!D4:D4', '!E4:E4', '!G4:G4', '!H4:H4', '!I4:I4'], targets: ['voltageValue_4', 'currentValue_4', 'powerValue_4', 'wattValue_4', 'kwhValue_4', 'totalValue_4'] }
];

// Call fetchData for each query
queries.forEach(query => {
    const { sheet, range, targets } = query;
    range.forEach((r, index) => {
        fetchData(sheet, r, targets[index], API_KEY, SPREADSHEET_ID);
    });
});

// Function to fetch data for all queries
function fetchDataForAllQueries() {
    queries.forEach(query => {
        const { sheet, range, targets } = query;
        range.forEach((r, index) => {
            fetchData(sheet, r, targets[index], API_KEY, SPREADSHEET_ID);
        });
    });
}

// Call fetchDataForAllQueries initially
fetchDataForAllQueries();

// Call fetchDataForAllQueries every 60 seconds
setInterval(fetchDataForAllQueries, 60000);

console.log('API.js loaded');