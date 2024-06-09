// Function to fetch data from Google Sheets for bar chart
async function fetchBarData() {
  const API_KEY = 'AIzaSyAlFSWmlf4FFtsWO6VzHZPxTTp-N1qjfU8';
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

// Function to fetch data for all outlets and initialize the bar chart
async function initBarChart() {
  const allData = await fetchBarData();

  if (!allData) return;

  // Extracting the last kWh value from column 8 for each outlet
  const labels = ['Outlet 1', 'Outlet 2', 'Outlet 3', 'Outlet 4'];
  const barKwhValues = allData.map(sheetData => {
      const lastRow = sheetData[sheetData.length - 1];  // Get the last row
      return Number(lastRow[8]); 
  });

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const data = {
      labels: labels,
      datasets: [{
          label: 'Total Energy in kWh',
          data: barKwhValues,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
          pointHitRadius: 50,
          pointBorderWidth: 2,
          fill: true,
      }]
  };

  const config = {
      type: 'bar',
      data: data,
      options: {
          scales: {
              y: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: 'Total Energy Consumed in kWh'
                  }
              },
              x: {
                  title: {
                      display: true,
                      text: `${currentMonth} ${currentYear}` // Updated x-axis title to display only current month and year
                  }
              }
          }
      }
  };

  const barCtx = document.getElementById('BarChart').getContext('2d');
  new Chart(barCtx, config);
}

// Initialize the bar chart
initBarChart();
