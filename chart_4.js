let myChart4; // Store chart instance

// Fetch data from Google Sheets
async function fetchData4() {

  const API_KEY = 'AIzaSyDyJ7gWMnvdBtmgmtwjf4Kovy-MX3prQKo';
  const SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ';
  const SHEET_NAME = 'Outlet 4';
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

// Process data to get highest value for each month4
function processMonthlyData4(rows) {
  const monthlyData = {};
  rows.forEach(row => {
    const date = new Date(row[0]);
    const month4 = date.getMonth();
    const year4 = date.getFullYear();
    const key = `${year4}-${month4}`; // Create a key using year4 and month4
    const totalKWhIndex = 8; // Assuming total kWh is in the ninth column (Column I)
    const value = parseFloat(row[totalKWhIndex]);
    if (!(key in monthlyData) || value > monthlyData[key]) {
      monthlyData[key] = value;
    }
  });
  return monthlyData; // Return an object with keys as month4-year4 and values as highest value
}

// Create chart with fetched data
async function createMonthlyChart4() {
  const rows = await fetchData4();
  const monthlyData = processMonthlyData4(rows);

  // Generate labels for each month4
  const monthLabels = [];
  const highestValues = [];
  const currentYear = new Date().getFullYear();
  const totalMonths = 12;
  for (let year4 = currentYear; year4 >= 2024; year4--) {
    for (let month4 = totalMonths - 1; month4 >= 0; month4--) {
      const key = `${year4}-${month4}`;
      const label = new Date(year4, month4).toLocaleDateString('en', { month4: 'long', year4: 'numeric' });
      monthLabels.unshift(label);
      highestValues.unshift(monthlyData[key] || 0); // Push the highest value or 0 if no data exists for the month4
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

  if (myChart4) {
    myChart4.destroy(); // Destroy existing chart instance
  }

  const ctx4 = document.getElementById('myAreaChart4').getContext('2d');
  myChart4 = new Chart(ctx4, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Create chart with fetched data
async function createYearlyChart4() {
  const data = await fetchData4();
  const yearlyData = processYearlyData4(data);

  // Generate labels for each year4
  const yearLabels = [];
  const totalEnergy = [];

  const currentYear = new Date().getFullYear();
  // Previous 3 years
  for (let year4 = currentYear - 3; year4 <= currentYear; year4++) {
    let sum = 0;
    for (let month4 = 0; month4 < 12; month4++) {
      const key = `${year4}-${month4}`;
      sum += yearlyData[key] || 0;
    }
    yearLabels.push(year4);
    totalEnergy.push(sum);
  }

  // Next year4
  let sum = 0;
  for (let month4 = 0; month4 < 12; month4++) {
    const key = `${currentYear + 1}-${month4}`;
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

  if (myChart4) {
    myChart4.destroy(); // Destroy existing chart instance
  }

  const ctx4 = document.getElementById('myAreaChart4').getContext('2d');
  myChart4 = new Chart(ctx4, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Process data to get total energy kWh for each year4
function processYearlyData4(data) {
  const yearlyData = {};
  data.forEach(row => {
    const date = new Date(row[0]);
    const year4 = date.getFullYear();
    const month4 = date.getMonth();
    const key = `${year4}-${month4}`; // Create a key using year4 and month4
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    yearlyData[key] = value;
  });
  return yearlyData; // Return an object with keys as year4-month4 and values as total energy kWh
}

document.querySelectorAll('.dropdown-item').forEach(function(item) {
    item.addEventListener('click', function() {
        var type = this.getAttribute('data-type');
        if (type === 'current-week4') {
        updateChartByCurrentWeek4('Week', 'Total Energy Consumed in kWh');
        } else if (type === 'month4') {
        createMonthlyChart4();
        } else if (type === 'year4') {
        createYearlyChart4();
        } else if (type === 'hours4') {
        createHourlyChart4();
        } else if (type === 'week') {
        createThisWeekDaysChart4(); // Call the function for current week days chart
        } else if (type === 'day4') {
        createWeeklyDaysChart4();
        }
        // Add cases for other types as needed
    });
});

// Function to update chart data based on current week
async function updateChartByCurrentWeek4(type, label) {
let labels = [];
let data = [];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const weeksInMonth = getWeeksInMonth4(currentMonth, currentYear);
labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1} of ${monthNames4[currentMonth]}`);

const fetchedData = await fetchData4();
const currentWeekData = processCurrentWeekData4(fetchedData);

for (let i = 0; i < weeksInMonth; i++) {
    const weekKey = `Week ${i + 1}`;
    data.push(currentWeekData[weekKey] || 0);
}

if (myChart4) {
    updateChart4(labels, data, label);
} else {
    initializeChart4(labels, data, label);
}
}

    // Function to update chart data based on selected type
    async function updateChartData4(type, label) {
  let labels = [];
  let data = [];

  switch (type) {
    case 'week':
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const weeksInMonth = getWeeksInMonth4(currentMonth, currentYear);
      labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1} of ${monthNames4[currentMonth]}`);

      const fetchedData = await fetchData4();
      const weeklyData = processWeeklyData4(fetchedData);

      for (let i = 0; i < weeksInMonth; i++) {
        const weekKey = `Week ${i + 1}`;
        data.push(weeklyData[weekKey] || 0);
      }
      break;
  }

  // Initialize or update the chart
  if (myChart4) {
    updateChart4(labels, data, label);
  } else {
    initializeChart4(labels, data, label);
  }
}

// Function to initialize the chart
function initializeChart4(labels, data, label) {
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

  const ctx4 = document.getElementById('myAreaChart4').getContext('2d');
  myChart4 = new Chart(ctx4, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Function to update the existing chart
function updateChart4(labels, data, label) {
myChart4.data.labels = labels;
myChart4.data.datasets[0].data = data;
myChart4.options.scales.y.title.text = label;
myChart4.options.scales.x.title.text = 'Week'; // Update x-axis title to 'Week'
myChart4.update();
}

// Process data to get total energy for each week of the current month4
function processWeeklyData4(data) {
const weeklyData = {};
const currentDate = new Date();
const currentMonth = currentDate.getMonth();

data.forEach(row => {
    const date = new Date(row[0]);
    const rowMonth = date.getMonth();

    if (rowMonth === currentMonth) {
    const weekNumber = getISOWeek4(date); // Get ISO week number for the date
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
function getISOWeek4(date) {
const dayOfWeek = date.getDay();
date.setDate(date.getDate() + 4 - dayOfWeek); // Set date to Thursday of the current week
const yearStart = new Date(date.getFullYear(), 0, 1); // January 1st of the current year4
return Math.ceil((((date - yearStart) / 86400000) + 1) / 7); // Calculate ISO week number
}

// Function to get the number of weeks in a month4
function getWeeksInMonth4(month4, year4) {
  const firstDay = new Date(year4, month4, 1);
  const lastDay = new Date(year4, month4 + 1, 0);
  const used = firstDay.getDay() + lastDay.getDate();
  return Math.ceil(used / 7);
}

// Global variable to hold month4 names
const monthNames4 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Function to get the days of the current week starting from Sunday
function getCurrentWeekDays4() {
const today = new Date();
const currentMonth = today.getMonth(); // Get the current month4 (0-indexed)
const currentYear = today.getFullYear(); // Get the current year4
const currentDayOfMonth = today.getDate();
const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
const firstDayOfWeek = new Date(firstDayOfMonth); // Clone the first day4 of the month4
const dayOffset = firstDayOfWeek.getDay(); // Calculate the offset to the previous Sunday

// If the current week starts off in the previous month4, adjust the starting day4
if (dayOffset > currentDayOfMonth % 7) {
  firstDayOfWeek.setMonth(firstDayOfWeek.getMonth());
}

firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOffset + 7); // Move to the first day4 of the next week

const weekDays = [];
for (let i = 0; i < 7; i++) {
  const day4 = new Date(firstDayOfWeek);
  day4.setDate(firstDayOfWeek.getDate() + i);
  const dayOfWeek = day4.toLocaleString('default', { weekday: 'long' }) + ', ' + getCurrentMonthName4(day4.getMonth()) + ' ' + day4.getDate() + ', ' + day4.getFullYear();
  weekDays.push(dayOfWeek);
}

return weekDays;
}

// Function to get the name of the current month4
function getCurrentMonthName4(monthIndex) {
const monthNames4 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
return monthNames4[monthIndex];
}

// Process data to get total kWh consumed for each day4 of the current week
function processCurrentWeekData4(data) {
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

function processWeeklyData4(data) {
const weeklyData = {};
const today = new Date();
const currentMonth = today.getMonth();
const previousMonth = (currentMonth - 1 + 12) % 12; // Adjust for previous month4 (handle year4 change)

data.forEach(row => {
  const date = new Date(row[0]);
  const month4 = date.getMonth();
  
  // Check if data belongs to current or previous month4
  if (month4 === currentMonth || month4 === previousMonth) {
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' }) + ', ' + getCurrentMonthName4(month4) + ' ' + date.getDate() + ', ' + date.getFullYear();
    const key = dayOfWeek;
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    
    // Update or set the maximum kWh for the day4
    if (!(key in weeklyData) || value > weeklyData[key]) {
      weeklyData[key] = value;
    }
  }
});

return weeklyData; // Return an object with keys as week and values as highest value
}

// Create chart with current week days and fetched data
async function createWeeklyDaysChart4() {
const data = await fetchData4();
const weekDays = getCurrentWeekDays4();
const weeklyData = processWeeklyData4(data);

// Extracting the relevant data for each day4 of the week
const chartData = {
    labels: weekDays,
    datasets: [{
    label: 'Total Energy in kWh',
    data: weekDays.map(day4 => weeklyData[day4] || 0),
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

// Destroy existing chart instance if it exists (myChart4)
if (myChart4) {
    myChart4.destroy();
}

const ctx4 = document.getElementById('myAreaChart4').getContext('2d');
myChart4 = new Chart(ctx4, {
    type: 'line',
    data: chartData,
    options: options
});
}

// Function to update chart data based on selected type
async function updateChartData4(type, label) {
switch (type) {
    case 'month4':
    await createMonthlyChart4();
    break;

    case 'year4':
    await createYearlyChart4();
    break;

    case 'hours4':
    await createHourlyChart4();
    break;

    default:
    break;
}
}

async function fetchDataForCurrentWeek4() {
try {
    const currentDate = new Date();
    const year4 = currentDate.getFullYear();
    const month4 = currentDate.getMonth() + 1;
    const day4 = currentDate.getDate();
    const currentDayOfWeek = currentDate.getDay();
    const firstDayOfWeek = day4 - currentDayOfWeek;
    const lastDayOfWeek = firstDayOfWeek + 6;
    const startDate = `${year4}-${month4}-${firstDayOfWeek}`;
    const endDate = `${year4}-${month4}-${lastDayOfWeek}`;

    const sheetName = 'Outlet 4'; // Update with your sheet name
    const range = 'A:L'; // Update with the correct range for your data
    const API_KEY = 'AIzaSyDyJ7gWMnvdBtmgmtwjf4Kovy-MX3prQKo';
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
function calculateHourlyTotalEnergy4(data) {
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
function generateHourlyLabels4() {
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

async function createHourlyChart4() {
const data = await fetchDataForCurrentWeek4();
const lastTotalKWh = getLastTotalKWh4(data);
const hourlyLabels = generateHourlyLabels4();

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

const ctx4 = document.getElementById('hourlyChart').getContext('2d');
const hourlyChart = new Chart(ctx4, {
    type: 'line',
    data: chartData,
    options: options
});
}


function getLastTotalKWh4(data) {
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

async function createHourlyChart4() {
const data = await fetchDataForCurrentWeek4();
const lastTotalKWh = getLastTotalKWh4(data);
const hourlyLabels = generateHourlyLabels4();

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

// Get the canvas4 element and rendering context
const canvas4 = document.getElementById('myAreaChart4');
const ctx4 = canvas4.getContext('2d');

// Destroy existing chart instance if it exists
if (myChart4) {
    myChart4.destroy();
}

// Create a new chart instance for the hourly chart
myChart4 = new Chart(ctx4, {
    type: 'line',
    data: chartData,
    options: options,
});
}