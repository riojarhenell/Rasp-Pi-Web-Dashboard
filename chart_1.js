let myChart1; // Store chart instance

// Fetch data from Google Sheets
async function fetchData1() {

  const API_KEY = 'AIzaSyDyJ7gWMnvdBtmgmtwjf4Kovy-MX3prQKo';
  const SPREADSHEET_ID = '1ISIsp_qHlT_KdmBycDXPHYB-58ShEhiDVJ518xAJlGQ';
  const SHEET_NAME = 'Outlet 1';
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

// Process data to get highest value for each month1
function processMonthlyData1(rows) {
  const monthlyData = {};
  rows.forEach(row => {
    const date = new Date(row[0]);
    const month1 = date.getMonth();
    const year1 = date.getFullYear();
    const key = `${year1}-${month1}`; // Create a key using year1 and month1
    const totalKWhIndex = 8; // Assuming total kWh is in the ninth column (Column I)
    const value = parseFloat(row[totalKWhIndex]);
    if (!(key in monthlyData) || value > monthlyData[key]) {
      monthlyData[key] = value;
    }
  });
  return monthlyData; // Return an object with keys as month1-year1 and values as highest value
}

// Create chart with fetched data
async function createMonthlyChart1() {
  const rows = await fetchData1();
  const monthlyData = processMonthlyData1(rows);

  // Generate labels for each month1
  const monthLabels = [];
  const highestValues = [];
  const currentYear = new Date().getFullYear();
  const totalMonths = 12;
  for (let year1 = currentYear; year1 >= 2024; year1--) {
    for (let month1 = totalMonths - 1; month1 >= 0; month1--) {
      const key = `${year1}-${month1}`;
      const label = new Date(year1, month1).toLocaleDateString('en', { month1: 'long', year1: 'numeric' });
      monthLabels.unshift(label);
      highestValues.unshift(monthlyData[key] || 0); // Push the highest value or 0 if no data exists for the month1
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

  if (myChart1) {
    myChart1.destroy(); // Destroy existing chart instance
  }

  const ctx1 = document.getElementById('myAreaChart1').getContext('2d');
  myChart1 = new Chart(ctx1, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Create chart with fetched data
async function createYearlyChart1() {
  const data = await fetchData1();
  const yearlyData = processYearlyData1(data);

  // Generate labels for each year1
  const yearLabels = [];
  const totalEnergy = [];

  const currentYear = new Date().getFullYear();
  // Previous 3 years
  for (let year1 = currentYear - 3; year1 <= currentYear; year1++) {
    let sum = 0;
    for (let month1 = 0; month1 < 12; month1++) {
      const key = `${year1}-${month1}`;
      sum += yearlyData[key] || 0;
    }
    yearLabels.push(year1);
    totalEnergy.push(sum);
  }

  // Next year1
  let sum = 0;
  for (let month1 = 0; month1 < 12; month1++) {
    const key = `${currentYear + 1}-${month1}`;
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

  if (myChart1) {
    myChart1.destroy(); // Destroy existing chart instance
  }

  const ctx1 = document.getElementById('myAreaChart1').getContext('2d');
  myChart1 = new Chart(ctx1, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Process data to get total energy kWh for each year1
function processYearlyData1(data) {
  const yearlyData = {};
  data.forEach(row => {
    const date = new Date(row[0]);
    const year1 = date.getFullYear();
    const month1 = date.getMonth();
    const key = `${year1}-${month1}`; // Create a key using year1 and month1
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    yearlyData[key] = value;
  });
  return yearlyData; // Return an object with keys as year1-month1 and values as total energy kWh
}

document.querySelectorAll('.dropdown-item').forEach(function(item) {
    item.addEventListener('click', function() {
        var type = this.getAttribute('data-type');
        if (type === 'current-week1') {
        updateChartByCurrentWeek1('Week', 'Total Energy Consumed in kWh');
        } else if (type === 'month1') {
        createMonthlyChart1();
        } else if (type === 'year1') {
        createYearlyChart1();
        } else if (type === 'hours1') {
        createHourlyChart1();
        } else if (type === 'week') {
        createThisWeekDaysChart1(); // Call the function for current week days chart
        } else if (type === 'day1') {
        createWeeklyDaysChart1();
        }
        // Add cases for other types as needed
    });
});

// Function to update chart data based on current week
async function updateChartByCurrentWeek1(type, label) {
let labels = [];
let data = [];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const weeksInMonth = getWeeksInMonth1(currentMonth, currentYear);
labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1} of ${monthNames1[currentMonth]}`);

const fetchedData = await fetchData1();
const currentWeekData = processCurrentWeekData1(fetchedData);

for (let i = 0; i < weeksInMonth; i++) {
    const weekKey = `Week ${i + 1}`;
    data.push(currentWeekData[weekKey] || 0);
}

if (myChart1) {
    updateChart1(labels, data, label);
} else {
    initializeChart1(labels, data, label);
}
}

    // Function to update chart data based on selected type
    async function updateChartData1(type, label) {
  let labels = [];
  let data = [];

  switch (type) {
    case 'week':
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const weeksInMonth = getWeeksInMonth1(currentMonth, currentYear);
      labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1} of ${monthNames1[currentMonth]}`);

      const fetchedData = await fetchData1();
      const weeklyData = processWeeklyData1(fetchedData);

      for (let i = 0; i < weeksInMonth; i++) {
        const weekKey = `Week ${i + 1}`;
        data.push(weeklyData[weekKey] || 0);
      }
      break;
  }

  // Initialize or update the chart
  if (myChart1) {
    updateChart1(labels, data, label);
  } else {
    initializeChart1(labels, data, label);
  }
}

// Function to initialize the chart
function initializeChart1(labels, data, label) {
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

  const ctx1 = document.getElementById('myAreaChart1').getContext('2d');
  myChart1 = new Chart(ctx1, {
    type: 'line',
    data: chartData,
    options: options
  });
}

// Function to update the existing chart
function updateChart1(labels, data, label) {
myChart1.data.labels = labels;
myChart1.data.datasets[0].data = data;
myChart1.options.scales.y.title.text = label;
myChart1.options.scales.x.title.text = 'Week'; // Update x-axis title to 'Week'
myChart1.update();
}

// Process data to get total energy for each week of the current month1
function processWeeklyData1(data) {
const weeklyData = {};
const currentDate = new Date();
const currentMonth = currentDate.getMonth();

data.forEach(row => {
    const date = new Date(row[0]);
    const rowMonth = date.getMonth();

    if (rowMonth === currentMonth) {
    const weekNumber = getISOWeek1(date); // Get ISO week number for the date
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
function getISOWeek1(date) {
const dayOfWeek = date.getDay();
date.setDate(date.getDate() + 4 - dayOfWeek); // Set date to Thursday of the current week
const yearStart = new Date(date.getFullYear(), 0, 1); // January 1st of the current year1
return Math.ceil((((date - yearStart) / 86400000) + 1) / 7); // Calculate ISO week number
}

// Function to get the number of weeks in a month1
function getWeeksInMonth1(month1, year1) {
  const firstDay = new Date(year1, month1, 1);
  const lastDay = new Date(year1, month1 + 1, 0);
  const used = firstDay.getDay() + lastDay.getDate();
  return Math.ceil(used / 7);
}

// Global variable to hold month1 names
const monthNames1 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Function to get the days of the current week starting from Sunday
function getCurrentWeekDays1() {
const today = new Date();
const currentMonth = today.getMonth(); // Get the current month1 (0-indexed)
const currentYear = today.getFullYear(); // Get the current year1
const currentDayOfMonth = today.getDate();
const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
const firstDayOfWeek = new Date(firstDayOfMonth); // Clone the first day1 of the month1
const dayOffset = firstDayOfWeek.getDay(); // Calculate the offset to the previous Sunday

// If the current week starts off in the previous month1, adjust the starting day1
if (dayOffset > currentDayOfMonth % 7) {
  firstDayOfWeek.setMonth(firstDayOfWeek.getMonth());
}

firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOffset + 7); // Move to the first day1 of the next week

const weekDays = [];
for (let i = 0; i < 7; i++) {
  const day1 = new Date(firstDayOfWeek);
  day1.setDate(firstDayOfWeek.getDate() + i);
  const dayOfWeek = day1.toLocaleString('default', { weekday: 'long' }) + ', ' + getCurrentMonthName1(day1.getMonth()) + ' ' + day1.getDate() + ', ' + day1.getFullYear();
  weekDays.push(dayOfWeek);
}

return weekDays;
}

// Function to get the name of the current month1
function getCurrentMonthName1(monthIndex) {
const monthNames1 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
return monthNames1[monthIndex];
}

// Process data to get total kWh consumed for each day1 of the current week
function processCurrentWeekData1(data) {
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

function processWeeklyData1(data) {
const weeklyData = {};
const today = new Date();
const currentMonth = today.getMonth();
const previousMonth = (currentMonth - 1 + 12) % 12; // Adjust for previous month1 (handle year1 change)

data.forEach(row => {
  const date = new Date(row[0]);
  const month1 = date.getMonth();
  
  // Check if data belongs to current or previous month1
  if (month1 === currentMonth || month1 === previousMonth) {
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' }) + ', ' + getCurrentMonthName1(month1) + ' ' + date.getDate() + ', ' + date.getFullYear();
    const key = dayOfWeek;
    const value = parseFloat(row[8]); // Assuming total kWh is in the ninth column (Column I)
    
    // Update or set the maximum kWh for the day1
    if (!(key in weeklyData) || value > weeklyData[key]) {
      weeklyData[key] = value;
    }
  }
});

return weeklyData; // Return an object with keys as week and values as highest value
}

// Create chart with current week days and fetched data
async function createWeeklyDaysChart1() {
const data = await fetchData1();
const weekDays = getCurrentWeekDays1();
const weeklyData = processWeeklyData1(data);

// Extracting the relevant data for each day1 of the week
const chartData = {
    labels: weekDays,
    datasets: [{
    label: 'Total Energy in kWh',
    data: weekDays.map(day1 => weeklyData[day1] || 0),
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

// Destroy existing chart instance if it exists (myChart1)
if (myChart1) {
    myChart1.destroy();
}

const ctx1 = document.getElementById('myAreaChart1').getContext('2d');
myChart1 = new Chart(ctx1, {
    type: 'line',
    data: chartData,
    options: options
});
}

// Function to update chart data based on selected type
async function updateChartData1(type, label) {
switch (type) {
    case 'month1':
    await createMonthlyChart1();
    break;

    case 'year1':
    await createYearlyChart1();
    break;

    case 'hours1':
    await createHourlyChart1();
    break;

    default:
    break;
}
}

async function fetchDataForCurrentWeek1() {
try {
    const currentDate = new Date();
    const year1 = currentDate.getFullYear();
    const month1 = currentDate.getMonth() + 1;
    const day1 = currentDate.getDate();
    const currentDayOfWeek = currentDate.getDay();
    const firstDayOfWeek = day1 - currentDayOfWeek;
    const lastDayOfWeek = firstDayOfWeek + 6;
    const startDate = `${year1}-${month1}-${firstDayOfWeek}`;
    const endDate = `${year1}-${month1}-${lastDayOfWeek}`;

    const sheetName = 'Outlet 1'; // Update with your sheet name
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
function calculateHourlyTotalEnergy1(data) {
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
function generateHourlyLabels1() {
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

async function createHourlyChart1() {
const data = await fetchDataForCurrentWeek1();
const lastTotalKWh = getLastTotalKWh1(data);
const hourlyLabels = generateHourlyLabels1();

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

const ctx1 = document.getElementById('hourlyChart').getContext('2d');
const hourlyChart = new Chart(ctx1, {
    type: 'line',
    data: chartData,
    options: options
});
}


function getLastTotalKWh1(data) {
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

async function createHourlyChart1() {
const data = await fetchDataForCurrentWeek1();
const lastTotalKWh = getLastTotalKWh1(data);
const hourlyLabels = generateHourlyLabels1();

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

// Get the canvas1 element and rendering context
const canvas1 = document.getElementById('myAreaChart1');
const ctx1 = canvas1.getContext('2d');

// Destroy existing chart instance if it exists
if (myChart1) {
    myChart1.destroy();
}

// Create a new chart instance for the hourly chart
myChart1 = new Chart(ctx1, {
    type: 'line',
    data: chartData,
    options: options,
});
}