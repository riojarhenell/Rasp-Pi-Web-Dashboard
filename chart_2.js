let myChart2; // Store chart instance

// Fetch data from Google Sheets
async function fetchData2() {

  const API_KEY = 'AIzaSyBw7KuNixpSAGIUSypH04yh38jF3hHLk38';
  const SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ';
  const SHEET_NAME = 'Outlet 2';
  const RANGE = '!A:L'; 

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}${RANGE}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data.values;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Process data to get highest value for each month2
function processMonthlyData2(rows) {
  const monthlyData = {};
  rows.forEach(row => {
    const date = new Date(row[0]);
    const month2 = date.getMonth();
    const year2 = date.getFullYear();
    const key = `${year2}-${month2}`; // Create a key using year2 and month2
    const totalKWhIndex = 8; // Assuming total kWh is in the ninth column (Column I)
    const value = parseFloat(row[totalKWhIndex]);
    if (!(key in monthlyData) || value > monthlyData[key]) {
      monthlyData[key] = value;
    }
  });
  return monthlyData; // Return an object with keys as month2-year2 and values as highest value
}

// Create chart with fetched data
async function createMonthlyChart2() {
  const rows = await fetchData2();
  const monthlyData = processMonthlyData2(rows);

  // Generate labels for each month2
  const monthLabels = [];
  const highestValues = [];
  const currentYear = new Date().getFullYear();
  const totalMonths = 12;
  for (let year2 = currentYear; year2 >= 2024; year2--) {
    for (let month2 = totalMonths - 1; month2 >= 0; month2--) {
      const key = `${year2}-${month2}`;
      const label = new Date(year2, month2).toLocaleDateString('en', { month2: 'long', year2: 'numeric' });
      monthLabels.unshift(label);
      highestValues.unshift(monthlyData[key] || 0); // Push the highest value or 0 if no data exists for the month2
    }
  }

  const chartData = {
    labels: monthLabels,
    datasets: [{
      label: 'Total Energy in kWh',
      data: highestValues,
      lineTension: 0.2,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(54, 162, 235, 1)",
      pointBorderColor: "rgba(54, 162, 235, 0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      fill: true, // Add this line to fill the area under the line
    }]
  };

  const options = {
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
          text: 'Month'
        }
      }
    }
  };

  if (myChart2) {
    myChart2.destroy(); // Destroy existing chart instance
  }

  const ctx2 = document.getElementById('myAreaChart2').getContext('2d');
  myChart2 = new Chart(ctx2, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Create chart with fetched data
async function createYearlyChart2() {
  const data = await fetchData2();
  const yearlyData = processYearlyData2(data);

  // Generate labels for each year2
  const yearLabels = [];
  const totalEnergy = [];

  const currentYear = new Date().getFullYear();
  // Previous 3 years
  for (let year2 = currentYear - 3; year2 <= currentYear; year2++) {
    let sum = 0;
    for (let month2 = 0; month2 < 12; month2++) {
      const key = `${year2}-${month2}`;
      sum += yearlyData[key] || 0;
    }
    yearLabels.push(year2);
    totalEnergy.push(sum);
  }

  // Next year2
  let sum = 0;
  for (let month2 = 0; month2 < 12; month2++) {
    const key = `${currentYear + 1}-${month2}`;
    sum += yearlyData[key] || 0;
  }
  yearLabels.push(currentYear + 1);
  totalEnergy.push(sum);

  const chartData = {
    labels: yearLabels,
    datasets: [{
      label: 'Total Energy in kWh',
      data: totalEnergy,
      lineTension: 0.2,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(54, 162, 235, 1)",
      pointBorderColor: "rgba(54, 162, 235, 0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      fill: true, // Add this line to fill the area under the line
    }]
  };

  const options = {
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
          text: 'Year'
        }
      }
    }
  };

  if (myChart2) {
    myChart2.destroy(); // Destroy existing chart instance
  }

  const ctx2 = document.getElementById('myAreaChart2').getContext('2d');
  myChart2 = new Chart(ctx2, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Process data to get total energy kWh for each year2
function processYearlyData2(data) {
  const yearlyData = {};
  data.forEach(row => {
    const date = new Date(row[0]);
    const year2 = date.getFullYear();
    const month2 = date.getMonth();
    const key = `${year2}-${month2}`; // Create a key using year2 and month2
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    yearlyData[key] = value;
  });
  return yearlyData; // Return an object with keys as year2-month2 and values as total energy kWh
}

document.querySelectorAll('.dropdown-item').forEach(function(item) {
    item.addEventListener('click', function() {
        var type = this.getAttribute('data-type');
        if (type === 'current-week2') {
        updateChartByCurrentWeek2('Week', 'Total Energy Consumed in kWh');
        } else if (type === 'month2') {
        createMonthlyChart2();
        } else if (type === 'year2') {
        createYearlyChart2();
        } else if (type === 'hours2') {
        createHourlyChart2();
        } else if (type === 'week') {
        createThisWeekDaysChart1(); // Call the function for current week days chart
        } else if (type === 'day2') {
        createWeeklyDaysChart2();
        }
        // Add cases for other types as needed
    });
});

// Function to update chart data based on current week
async function updateChartByCurrentWeek2(type, label) {
let labels = [];
let data = [];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const weeksInMonth = getWeeksInMonth2(currentMonth, currentYear);
labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1} of ${monthNames2[currentMonth]}`);

const fetchedData = await fetchData2();
const currentWeekData = processCurrentWeekData2(fetchedData);

for (let i = 0; i < weeksInMonth; i++) {
    const weekKey = `Week ${i + 1}`;
    data.push(currentWeekData[weekKey] || 0);
}

if (myChart2) {
    updateChart2(labels, data, label);
} else {
    initializeChart2(labels, data, label);
}
}

    // Function to update chart data based on selected type
    async function updateChartData2(type, label) {
  let labels = [];
  let data = [];

  switch (type) {
    case 'week':
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const weeksInMonth = getWeeksInMonth2(currentMonth, currentYear);
      labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1} of ${monthNames2[currentMonth]}`);

      const fetchedData = await fetchData2();
      const weeklyData = processWeeklyData2(fetchedData);

      for (let i = 0; i < weeksInMonth; i++) {
        const weekKey = `Week ${i + 1}`;
        data.push(weeklyData[weekKey] || 0);
      }
      break;
  }

  // Initialize or update the chart
  if (myChart2) {
    updateChart2(labels, data, label);
  } else {
    initializeChart2(labels, data, label);
  }
}

// Function to initialize the chart
function initializeChart2(labels, data, label) {
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Total Energy in kWh',
      data: data,
      lineTension: 0.2,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(54, 162, 235, 1)",
      pointBorderColor: "rgba(54, 162, 235, 0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      fill: true, // Add this line to fill the area under the line
    }]
  };

  const options = {
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
          text: 'Week of the Month'
        }
      }
    }
  };

  const ctx2 = document.getElementById('myAreaChart2').getContext('2d');
  myChart2 = new Chart(ctx2, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Function to update the existing chart
function updateChart2(labels, data, label) {
myChart2.data.labels = labels;
myChart2.data.datasets[0].data = data;
myChart2.options.scales.y.title.text = label;
myChart2.options.scales.x.title.text = 'Week'; // Update x-axis title to 'Week'
myChart2.update();
}

// Process data to get total energy for each week of the current month2
function processWeeklyData2(data) {
const weeklyData = {};
const currentDate = new Date();
const currentMonth = currentDate.getMonth();

data.forEach(row => {
    const date = new Date(row[0]);
    const rowMonth = date.getMonth();

    if (rowMonth === currentMonth) {
    const weekNumber = getISOWeek2(date); // Get ISO week number for the date
    const weekKey = `Week ${weekNumber}`;

    const energyConsumed = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)

    if (weeklyData[weekKey]) {
        weeklyData[weekKey] += energyConsumed;
    } else {
        weeklyData[weekKey] = energyConsumed;
    }
    }
});

return weeklyData;
}

// Function to get ISO week number for a given date
function getISOWeek2(date) {
const dayOfWeek = date.getDay();
date.setDate(date.getDate() + 4 - dayOfWeek); // Set date to Thursday of the current week
const yearStart = new Date(date.getFullYear(), 0, 1); // January 1st of the current year2
return Math.ceil((((date - yearStart) / 86400000) + 1) / 7); // Calculate ISO week number
}

// Function to get the number of weeks in a month2
function getWeeksInMonth2(month2, year2) {
  const firstDay = new Date(year2, month2, 1);
  const lastDay = new Date(year2, month2 + 1, 0);
  const used = firstDay.getDay() + lastDay.getDate();
  return Math.ceil(used / 7);
}

// Global variable to hold month2 names
const monthNames2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Function to get the days of the current week starting from Sunday
function getCurrentWeekDays2() {
const today = new Date();
const currentMonth = today.getMonth(); // Get the current month2 (0-indexed)
const currentYear = today.getFullYear(); // Get the current year2
const currentDayOfMonth = today.getDate();
const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
const firstDayOfWeek = new Date(firstDayOfMonth); // Clone the first day2 of the month2
const dayOffset = firstDayOfWeek.getDay(); // Calculate the offset to the previous Sunday

// If the current week starts off in the previous month2, adjust the starting day2
if (dayOffset > currentDayOfMonth % 7) {
  firstDayOfWeek.setMonth(firstDayOfWeek.getMonth());
}

firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOffset + 7); // Move to the first day2 of the next week

const weekDays = [];
for (let i = 0; i < 7; i++) {
  const day2 = new Date(firstDayOfWeek);
  day2.setDate(firstDayOfWeek.getDate() + i);
  const dayOfWeek = day2.toLocaleString('default', { weekday: 'long' }) + ', ' + getCurrentMonthName2(day2.getMonth()) + ' ' + day2.getDate() + ', ' + day2.getFullYear();
  weekDays.push(dayOfWeek);
}

return weekDays;
}

// Function to get the name of the current month2
function getCurrentMonthName2(monthIndex) {
const monthNames2 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
return monthNames2[monthIndex];
}

// Process data to get total kWh consumed for each day2 of the current week
function processCurrentWeekData2(data) {
const currentWeekData = {};
data.forEach(row => {
    const date = new Date(row[0]);
    const currentMonth = new Date().getMonth();
    if (date.getMonth() === currentMonth) {
    const week = Math.ceil(date.getDate() / 7);
    const key = `Week ${week}`;
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    if (!(key in currentWeekData) || value > currentWeekData[key]) {
        currentWeekData[key] = value;
    }
    }
});
return currentWeekData; // Return an object with keys as week and values as highest value
}

function processWeeklyData2(data) {
const weeklyData = {};
const today = new Date();
const currentMonth = today.getMonth();
const previousMonth = (currentMonth - 1 + 12) % 12; // Adjust for previous month2 (handle year2 change)

data.forEach(row => {
  const date = new Date(row[0]);
  const month2 = date.getMonth();
  
  // Check if data belongs to current or previous month2
  if (month2 === currentMonth || month2 === previousMonth) {
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' }) + ', ' + getCurrentMonthName2(month2) + ' ' + date.getDate() + ', ' + date.getFullYear();
    const key = dayOfWeek;
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    
    // Update or set the maximum kWh for the day2
    if (!(key in weeklyData) || value > weeklyData[key]) {
      weeklyData[key] = value;
    }
  }
});

return weeklyData; // Return an object with keys as week and values as highest value
}

// Create chart with current week days and fetched data
async function createWeeklyDaysChart2() {
const data = await fetchData2();
const weekDays = getCurrentWeekDays2();
const weeklyData = processWeeklyData2(data);

// Extracting the relevant data for each day2 of the week
const chartData = {
    labels: weekDays,
    datasets: [{
    label: 'Total Energy in kWh',
    data: weekDays.map(day2 => weeklyData[day2] || 0),
    lineTension: 0.2,
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgba(54, 162, 235, 1)",
    pointRadius: 3,
    pointBackgroundColor: "rgba(54, 162, 235, 1)",
    pointBorderColor: "rgba(54, 162, 235, 0.8)",
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
    pointHitRadius: 50,
    pointBorderWidth: 2,
    fill: true,
    }]
};

const options = {
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
        text: 'Day of the Week'
        }
    }
    }
};

// Destroy existing chart instance if it exists (myChart2)
if (myChart2) {
    myChart2.destroy();
}

const ctx2 = document.getElementById('myAreaChart2').getContext('2d');
myChart2 = new Chart(ctx2, {
    type: 'line',
    data: chartData,
    options: options
});
}

// Function to update chart data based on selected type
async function updateChartData2(type, label) {
switch (type) {
    case 'month2':
    await createMonthlyChart2();
    break;

    case 'year2':
    await createYearlyChart2();
    break;

    case 'hours2':
    await createHourlyChart2();
    break;

    default:
    break;
}
}

async function fetchDataForCurrentWeek2() {
try {
    const currentDate = new Date();
    const year2 = currentDate.getFullYear();
    const month2 = currentDate.getMonth() + 1;
    const day2 = currentDate.getDate();
    const currentDayOfWeek = currentDate.getDay();
    const firstDayOfWeek = day2 - currentDayOfWeek;
    const lastDayOfWeek = firstDayOfWeek + 6;
    const startDate = `${year2}-${month2}-${firstDayOfWeek}`;
    const endDate = `${year2}-${month2}-${lastDayOfWeek}`;

    const sheetName = 'Outlet 2'; // Update with your sheet name
    const range = 'A:L'; // Update with the correct range for your data
    const API_KEY = 'AIzaSyBw7KuNixpSAGIUSypH04yh38jF3hHLk38';
    const SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log('Fetched data:', data);

    if (data.error) {
    console.error('Google Sheets API Error:', data.error.message);
    return null;
    }

    if (data && data.values && Array.isArray(data.values)) {
    const filteredData = data.values.filter(row => {
        const rowDate = new Date(row[0]);
        return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
    });
    console.log('Filtered data for current week:', filteredData);
    return filteredData;
    } else {
    console.error('Unexpected data format:', data);
    return null;
    }
} catch (error) {
    console.error('Error fetching or filtering data:', error);
    return null;
}
}

// Process data to calculate hourly total energy consumption
function calculateHourlyTotalEnergy2(data) {
  if (!data || data.length === 0) return Array.from({ length: 24 }, () => 0); // Default to zeros if no data

  const hourlyTotalEnergy = Array.from({ length: 24 }, () => 0);

  data.forEach(row => {
    const timeString = row[1]; // Time string in column B
    const totalEnergy = parseFloat(row[8]); // Total energy in column C

    if (!isNaN(totalEnergy)) {
      const timeComponents = timeString.split(' ')[0].split(':');
      const hour = parseInt(timeComponents[0]);

      if (!isNaN(hour) && hour >= 0 && hour < 24) {
        hourlyTotalEnergy[hour] += totalEnergy;
      }
    }
  });

  return hourlyTotalEnergy;
}

// Function to generate labels for hourly data from 12:00 AM to the current hour
function generateHourlyLabels2() {
const labels = [];
const now = new Date();
const currentHour = now.getHours();

for (let i = 0; i <= currentHour; i++) {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? 'AM' : 'PM';
  labels.push(`${hour}:00 ${period}`);
}

return labels;
}

async function createHourlyChart2() {
const data = await fetchDataForCurrentWeek2();
const lastTotalKWh = getLastTotalKWh2(data);
const hourlyLabels = generateHourlyLabels2();

const chartData = {
    labels: hourlyLabels,
    datasets: [{
    label: 'Total Energy in kWh',
    data: lastTotalKWh,
    lineTension: 0.2,
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgba(54, 162, 235, 1)",
    pointRadius: 3,
    pointBackgroundColor: "rgba(54, 162, 235, 1)",
    pointBorderColor: "rgba(54, 162, 235, 0.8)",
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
    pointHitRadius: 10,
    pointBorderWidth: 2,
    fill: true
    }]
};

const options = {
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
        text: 'Hour of the Day'
        }
    }
    }
};

const ctx2 = document.getElementById('hourlyChart').getContext('2d');
const hourlyChart = new Chart(ctx2, {
    type: 'line',
    data: chartData,
    options: options
});
}


function getLastTotalKWh2(data) {
const hourlyData = Array.from({ length: 24 }, () => 0); // Initialize hourly data array

// Iterate over rows to extract hourly kWh values
data.forEach(row => {
    const dateTimeString = `${row[0]} ${row[1]}`; // Combine date and time strings
    const dateTime = new Date(dateTimeString); // Parse combined datetime string
    const hourIndex = dateTime.getHours(); // Extract hour (0-23) from datetime

    const totalKWh = parseFloat(row[8]); // Parse total kWh value from column I (index 8)

    // Update hourlyData with the latest total kWh value for each hour
    if (!isNaN(totalKWh) && hourIndex >= 0 && hourIndex < 24) {
    hourlyData[hourIndex] = totalKWh; // Update the hourly data with the latest value
    }
});

return hourlyData;
}

async function createHourlyChart2() {
const data = await fetchDataForCurrentWeek2();
const lastTotalKWh = getLastTotalKWh2(data);
const hourlyLabels = generateHourlyLabels2();

const chartData = {
    labels: hourlyLabels,
    datasets: [
    {
        label: 'Total Energy in kWh',
        data: lastTotalKWh,
        lineTension: 0.2,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 3,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: 'rgba(54, 162, 235, 0.8)',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointHitRadius: 10,
        pointBorderWidth: 2,
        fill: true,
    },
    ],
};

const options = {
    scales: {
    y: {
        beginAtZero: true,
        title: {
        display: true,
        text: 'Total Energy Consumed in kWh',
        },
    },
    x: {
        title: {
        display: true,
        text: 'Today\'s Hours',
        },
    },
    },
};

// Get the canvas2 element and rendering context
const canvas2 = document.getElementById('myAreaChart2');
const ctx2 = canvas2.getContext('2d');

// Destroy existing chart instance if it exists
if (myChart2) {
    myChart2.destroy();
}

// Create a new chart instance for the hourly chart
myChart2 = new Chart(ctx2, {
    type: 'line',
    data: chartData,
    options: options,
});
}