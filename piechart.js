// Function to fetch data from Google Sheets for pie chart
async function fetchPieData() {
    const API_KEY = 'AIzaSyCsaJ2WzAGzSWjC9xXw6vCkm1f8qFW5Mb8';
    const SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ';
    const RANGE = '!A:L';
    const outletNames = ['Outlet 1', 'Outlet 2', 'Outlet 3', 'Outlet 4'];
    const urls = outletNames.map(outlet => 
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${outlet}${RANGE}?key=${API_KEY}`
    );

    try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const allData = await Promise.all(responses.map(response => response.json()));
        return allData.map(data => data.values);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}

// Function to fetch data for all outlets and initialize the pie chart
async function initPieChart() {
    const allData = await fetchPieData();

    if (!allData) return;

    // Extracting the last kWh value from column 8 for each outlet
    const outletNames = ['Outlet 1', 'Outlet 2', 'Outlet 3', 'Outlet 4'];
    const pieKwhValues = allData.map(sheetData => {
        const lastRow = sheetData[sheetData.length - 1];  // Get the last row
        return Number(lastRow[8]); 
    });

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();


    const pieData = {
        labels: outletNames,
        datasets: [{
            label: 'Total Energy in kWh',
            data: pieKwhValues,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            pointHitRadius: 50,
            pointBorderWidth: 2,
        }]
    };

    const pieConfig = {
        type: 'pie',
        data: pieData,
        options: {
            aspectRatio: 2.5, // Set aspect ratio to maintain a square shape
            scales: {
                x: {
                    title: {
                        display: true,
                        text: `${currentMonth} ${currentYear}` // Updated x-axis title to display only current month and year
                    },
                    grid: {
                        display: false // Hide x-axis grid lines
                    },
                    ticks: {
                        display: false // Hide x-axis grid lines
                    }
                }
            }
        }
    };
    
    const pieCtx = document.getElementById('PieChart').getContext('2d');
    new Chart(pieCtx, pieConfig);
}

// Initialize the pie chart
initPieChart();
