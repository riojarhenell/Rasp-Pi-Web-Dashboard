let myChart3; // Store chart instance

// Fetch data from Google Sheets
async function fetchData3() {

  const API_KEY = 'AIzaSyC0bmDWFvgwAxn2dPopgT3NmFNEbKbu0ac';
  const SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ';
  const SHEET_NAME = 'Outlet 3';
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

// Process data to get highest value for each month3
function processMonthlyData3(rows) {
  const monthlyData = {};
  rows.forEach(row => {
    const date = new Date(row[0]);
    const month3 = date.getMonth();
    const year3 = date.getFullYear();
    const key = `${year3}-${month3}`; // Create a key using year3 and month3
    const totalKWhIndex = 8; // Assuming total kWh is in the ninth column (Column I)
    const value = parseFloat(row[totalKWhIndex]);
    if (!(key in monthlyData) || value > monthlyData[key]) {
      monthlyData[key] = value;
    }
  });
  return monthlyData; // Return an object with keys as month3-year3 and values as highest value
}

// Create chart with fetched data
async function createMonthlyChart3() {
  const rows = await fetchData3();
  const monthlyData = processMonthlyData3(rows);

  // Generate labels for each month3
  const monthLabels = [];
  const highestValues = [];
  const currentYear = new Date().getFullYear();
  const totalMonths = 12;
  for (let year3 = currentYear; year3 >= 2024; year3--) {
    for (let month3 = totalMonths - 1; month3 >= 0; month3--) {
      const key = `${year3}-${month3}`;
      const label = new Date(year3, month3).toLocaleDateString('en', { month3: 'long', year3: 'numeric' });
      monthLabels.unshift(label);
      highestValues.unshift(monthlyData[key] || 0); // Push the highest value or 0 if no data exists for the month3
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

  if (myChart3) {
    myChart3.destroy(); // Destroy existing chart instance
  }

  const ctx3 = document.getElementById('myAreaChart3').getContext('2d');
  myChart3 = new Chart(ctx3, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Create chart with fetched data
async function createYearlyChart3() {
  const data = await fetchData3();
  const yearlyData = processYearlyData3(data);

  // Generate labels for each year3
  const yearLabels = [];
  const totalEnergy = [];

  const currentYear = new Date().getFullYear();
  // Previous 3 years
  for (let year3 = currentYear - 3; year3 <= currentYear; year3++) {
    let sum = 0;
    for (let month3 = 0; month3 < 12; month3++) {
      const key = `${year3}-${month3}`;
      sum += yearlyData[key] || 0;
    }
    yearLabels.push(year3);
    totalEnergy.push(sum);
  }

  // Next year3
  let sum = 0;
  for (let month3 = 0; month3 < 12; month3++) {
    const key = `${currentYear + 1}-${month3}`;
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

  if (myChart3) {
    myChart3.destroy(); // Destroy existing chart instance
  }

  const ctx3 = document.getElementById('myAreaChart3').getContext('2d');
  myChart3 = new Chart(ctx3, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Process data to get total energy kWh for each year3
function processYearlyData3(data) {
  const yearlyData = {};
  data.forEach(row => {
    const date = new Date(row[0]);
    const year3 = date.getFullYear();
    const month3 = date.getMonth();
    const key = `${year3}-${month3}`; // Create a key using year3 and month3
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    yearlyData[key] = value;
  });
  return yearlyData; // Return an object with keys as year3-month3 and values as total energy kWh
}

document.querySelectorAll('.dropdown-item').forEach(function(item) {
    item.addEventListener('click', function() {
        var type = this.getAttribute('data-type');
        if (type === 'current-week3') {
        updateChartByCurrentWeek3('Week', 'Total Energy Consumed in kWh');
        } else if (type === 'month3') {
        createMonthlyChart3();
        } else if (type === 'year3') {
        createYearlyChart3();
        } else if (type === 'hours3') {
        createHourlyChart3();
        } else if (type === 'week') {
        createThisWeekDaysChart3(); // Call the function for current week days chart
        } else if (type === 'day3') {
        createWeeklyDaysChart3();
        }
        // Add cases for other types as needed
    });
});

// Function to update chart data based on current week
async function updateChartByCurrentWeek3(type, label) {
let labels = [];
let data = [];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const weeksInMonth = getWeeksInMonth3(currentMonth, currentYear);
labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1} of ${monthNames3[currentMonth]}`);

const fetchedData = await fetchData3();
const currentWeekData = processCurrentWeekData3(fetchedData);

for (let i = 0; i < weeksInMonth; i++) {
    const weekKey = `Week ${i + 1}`;
    data.push(currentWeekData[weekKey] || 0);
}

if (myChart3) {
    updateChart3(labels, data, label);
} else {
    initializeChart3(labels, data, label);
}
}

    // Function to update chart data based on selected type
    async function updateChartData3(type, label) {
  let labels = [];
  let data = [];

  switch (type) {
    case 'week':
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const weeksInMonth = getWeeksInMonth3(currentMonth, currentYear);
      labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1} of ${monthNames3[currentMonth]}`);

      const fetchedData = await fetchData3();
      const weeklyData = processWeeklyData3(fetchedData);

      for (let i = 0; i < weeksInMonth; i++) {
        const weekKey = `Week ${i + 1}`;
        data.push(weeklyData[weekKey] || 0);
      }
      break;
  }

  // Initialize or update the chart
  if (myChart3) {
    updateChart3(labels, data, label);
  } else {
    initializeChart3(labels, data, label);
  }
}

// Function to initialize the chart
function initializeChart3(labels, data, label) {
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

  const ctx3 = document.getElementById('myAreaChart3').getContext('2d');
  myChart3 = new Chart(ctx3, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Function to update the existing chart
function updateChart3(labels, data, label) {
myChart3.data.labels = labels;
myChart3.data.datasets[0].data = data;
myChart3.options.scales.y.title.text = label;
myChart3.options.scales.x.title.text = 'Week'; // Update x-axis title to 'Week'
myChart3.update();
}

// Process data to get total energy for each week of the current month3
function processWeeklyData3(data) {
const weeklyData = {};
const currentDate = new Date();
const currentMonth = currentDate.getMonth();

data.forEach(row => {
    const date = new Date(row[0]);
    const rowMonth = date.getMonth();

    if (rowMonth === currentMonth) {
    const weekNumber = getISOWeek3(date); // Get ISO week number for the date
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
function getISOWeek3(date) {
const dayOfWeek = date.getDay();
date.setDate(date.getDate() + 4 - dayOfWeek); // Set date to Thursday of the current week
const yearStart = new Date(date.getFullYear(), 0, 1); // January 1st of the current year3
return Math.ceil((((date - yearStart) / 86400000) + 1) / 7); // Calculate ISO week number
}

// Function to get the number of weeks in a month3
function getWeeksInMonth3(month3, year3) {
  const firstDay = new Date(year3, month3, 1);
  const lastDay = new Date(year3, month3 + 1, 0);
  const used = firstDay.getDay() + lastDay.getDate();
  return Math.ceil(used / 7);
}

// Global variable to hold month3 names
const monthNames3 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Function to get the days of the current week starting from Sunday
function getCurrentWeekDays3() {
const today = new Date();
const currentMonth = today.getMonth(); // Get the current month3 (0-indexed)
const currentYear = today.getFullYear(); // Get the current year3
const currentDayOfMonth = today.getDate();
const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
const firstDayOfWeek = new Date(firstDayOfMonth); // Clone the first day3 of the month3
const dayOffset = firstDayOfWeek.getDay(); // Calculate the offset to the previous Sunday

// If the current week starts off in the previous month3, adjust the starting day3
if (dayOffset > currentDayOfMonth % 7) {
  firstDayOfWeek.setMonth(firstDayOfWeek.getMonth());
}

firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOffset + 7); // Move to the first day3 of the next week

const weekDays = [];
for (let i = 0; i < 7; i++) {
  const day3 = new Date(firstDayOfWeek);
  day3.setDate(firstDayOfWeek.getDate() + i);
  const dayOfWeek = day3.toLocaleString('default', { weekday: 'long' }) + ', ' + getCurrentMonthName3(day3.getMonth()) + ' ' + day3.getDate() + ', ' + day3.getFullYear();
  weekDays.push(dayOfWeek);
}

return weekDays;
}

// Function to get the name of the current month3
function getCurrentMonthName3(monthIndex) {
const monthNames3 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
return monthNames3[monthIndex];
}

// Process data to get total kWh consumed for each day3 of the current week
function processCurrentWeekData3(data) {
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

function processWeeklyData3(data) {
const weeklyData = {};
const today = new Date();
const currentMonth = today.getMonth();
const previousMonth = (currentMonth - 1 + 12) % 12; // Adjust for previous month3 (handle year3 change)

data.forEach(row => {
  const date = new Date(row[0]);
  const month3 = date.getMonth();
  
  // Check if data belongs to current or previous month3
  if (month3 === currentMonth || month3 === previousMonth) {
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' }) + ', ' + getCurrentMonthName3(month3) + ' ' + date.getDate() + ', ' + date.getFullYear();
    const key = dayOfWeek;
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    
    // Update or set the maximum kWh for the day3
    if (!(key in weeklyData) || value > weeklyData[key]) {
      weeklyData[key] = value;
    }
  }
});

return weeklyData; // Return an object with keys as week and values as highest value
}

// Create chart with current week days and fetched data
async function createWeeklyDaysChart3() {
const data = await fetchData3();
const weekDays = getCurrentWeekDays3();
const weeklyData = processWeeklyData3(data);

// Extracting the relevant data for each day3 of the week
const chartData = {
    labels: weekDays,
    datasets: [{
    label: 'Total Energy in kWh',
    data: weekDays.map(day3 => weeklyData[day3] || 0),
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

// Destroy existing chart instance if it exists (myChart3)
if (myChart3) {
    myChart3.destroy();
}

const ctx3 = document.getElementById('myAreaChart3').getContext('2d');
myChart3 = new Chart(ctx3, {
    type: 'line',
    data: chartData,
    options: options
});
}

// Function to update chart data based on selected type
async function updateChartData3(type, label) {
switch (type) {
    case 'month3':
    await createMonthlyChart3();
    break;

    case 'year3':
    await createYearlyChart3();
    break;

    case 'hours3':
    await createHourlyChart3();
    break;

    default:
    break;
}
}

async function fetchDataForCurrentWeek3() {
try {
    const currentDate = new Date();
    const year3 = currentDate.getFullYear();
    const month3 = currentDate.getMonth() + 1;
    const day3 = currentDate.getDate();
    const currentDayOfWeek = currentDate.getDay();
    const firstDayOfWeek = day3 - currentDayOfWeek;
    const lastDayOfWeek = firstDayOfWeek + 6;
    const startDate = `${year3}-${month3}-${firstDayOfWeek}`;
    const endDate = `${year3}-${month3}-${lastDayOfWeek}`;

    const sheetName = 'Outlet 3'; // Update with your sheet name
    const range = 'A:L'; // Update with the correct range for your data
    const API_KEY = 'AIzaSyC0bmDWFvgwAxn2dPopgT3NmFNEbKbu0ac';
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
function calculateHourlyTotalEnergy3(data) {
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
function generateHourlyLabels3() {
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

async function createHourlyChart3() {
const data = await fetchDataForCurrentWeek3();
const lastTotalKWh = getLastTotalKWh3(data);
const hourlyLabels = generateHourlyLabels3();

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

const ctx3 = document.getElementById('hourlyChart').getContext('2d');
const hourlyChart = new Chart(ctx3, {
    type: 'line',
    data: chartData,
    options: options
});
}


function getLastTotalKWh3(data) {
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

async function createHourlyChart3() {
const data = await fetchDataForCurrentWeek3();
const lastTotalKWh = getLastTotalKWh3(data);
const hourlyLabels = generateHourlyLabels3();

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

// Get the canvas3 element and rendering context
const canvas3 = document.getElementById('myAreaChart3');
const ctx3 = canvas3.getContext('2d');

// Destroy existing chart instance if it exists
if (myChart3) {
    myChart3.destroy();
}

// Create a new chart instance for the hourly chart
myChart3 = new Chart(ctx3, {
    type: 'line',
    data: chartData,
    options: options,
});
}