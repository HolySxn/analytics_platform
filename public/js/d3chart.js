// Set dimensions and margins for the chart
const margin = { top: 50, right: 30, bottom: 50, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Append SVG object to the chart container
const svg = d3.select("#suicideChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Fetch and populate datalist with countries
async function loadCountries() {
  try {
    const response = await fetch('/api/countries');
    if (!response.ok) throw new Error("Failed to load countries");
    
    const countries = await response.json();
    const countryList = document.getElementById("countryList");
    countryList.innerHTML = ""; // Clear existing options

    countries.forEach(country => {
      const option = document.createElement("option");
      option.value = country; // `value` is used for selection in <datalist>
      countryList.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading countries:", error);
  }
}

// Fetch data from the API based on selected country, field, and time range
async function fetchData(country, field, startYear, endYear, allCountries) {
  try {
    const query = allCountries ? `/api/suicideRates?field=${field}&startYear=${startYear}&endYear=${endYear}` : `/api/suicideRates?country=${country}&field=${field}&startYear=${startYear}&endYear=${endYear}`;
    console.log("Fetching data with query:", query);

    const response = await fetch(query);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    console.log("Data received:", data);

    const formattedData = [];
    for (let year = startYear; year <= endYear; year++) {
      let totalRate = 0;
      let count = 0;

      data.forEach(item => {
        const rateKey = `SuicideRate_${field}_RatePer100k_${year}`;
        if (item[rateKey]) {
          totalRate += parseFloat(item[rateKey]);
          count++;
        }
      });

      if (count > 0) {
        formattedData.push({
          year: year,
          rate: totalRate / count // Average rate for all countries in this year
        });
      }
    }

    return formattedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Calculate statistics for the data array
function calculateStatistics(data) {
  const rates = data.map(d => d.rate);
  const average = d3.mean(rates);
  const min = d3.min(rates);
  const max = d3.max(rates);
  const stdDev = d3.deviation(rates);

  // Update statistics display
  document.getElementById("average").textContent = `Average: ${average.toFixed(2)}`;
  document.getElementById("min").textContent = `Minimum: ${min.toFixed(2)}`;
  document.getElementById("max").textContent = `Maximum: ${max.toFixed(2)}`;
  document.getElementById("stdDev").textContent = `Standard Deviation: ${stdDev.toFixed(2)}`;
}

// Render the chart based on selected options
async function renderChart() {
  const country = document.getElementById('country').value;
  const field = document.getElementById('field').value;
  const startYear = parseInt(document.getElementById('startYear').value);
  const endYear = parseInt(document.getElementById('endYear').value);
  const chartType = document.getElementById('chartType').value;
  const allCountries = document.getElementById('allCountries').checked;

  // Validate input values
  if ((!allCountries && !country) || isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
    alert("Please select valid options.");
    return;
  }

  const data = await fetchData(country, field, startYear, endYear, allCountries);
  if (!data || data.length === 0) {
    alert("No data available for the selected options.");
    return;
  }

  // Calculate statistics
  calculateStatistics(data);

  // Clear existing chart content
  svg.selectAll("*").remove();

  // X-axis scale (years)
  const x = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, width])
    .padding(0.1);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y-axis scale (suicide rate)
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.rate) + 5]) // Add some padding above the max value
    .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));

  // Draw chart based on selected type
  if (chartType === "line") {
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y(d.rate))
      );

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.year) + x.bandwidth() / 2)
      .attr("cy", d => y(d.rate))
      .attr("r", 4)
      .attr("fill", "steelblue");
  } else if (chartType === "bar") {
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.year))
      .attr("y", d => y(d.rate))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.rate))
      .attr("fill", "steelblue");
  }

  // Add labels to the axes
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .style("text-anchor", "middle")
    .text("Year");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .text("Suicide Rate per 100k");
}

// Initialize the datalist and add event listener for updating the chart
loadCountries();
document.getElementById('updateChart').addEventListener('click', renderChart);
