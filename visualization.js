// Load the CSV data from your file.
d3.csv('https://raw.githubusercontent.com/audreyleighleigh/EconApp/c20a740318c2e5b9e1ddd68eb961c35d1899ccda/WixCSV.csv')
  .then(function (data) {
    // Convert data types if needed
    data.forEach(function (d) {
      d.YEAR = +d.YEAR;
      d.SIZE = +d.SIZE;
    });

    // Set up SVG dimensions and margins
    const width = 800;
    const height = 800;
    const margin = { top: 150, right: 200, bottom: 100, left: 60 }; // Increased the right margin

    // Create the SVG element
    const svg = d3.select('#visualization-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create a scale for the x-coordinate
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.YEAR))
      .range([margin.left, width - margin.right]);

    // Create a scale for the shirt size
    const sizeScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.SIZE))
      .range([100, 500]); 

    // Create the shirt image
    const shirt = svg.append('image')
      .attr('href', 'https://raw.githubusercontent.com/audreyleighleigh/EconApp/c20a740318c2e5b9e1ddd68eb961c35d1899ccda/Shirt.png')
      .attr('y', margin.top + 150) // Move the shirt lower
      .attr('width', 500) 
      .attr('height', 500); 

    // Create a text label to display the current year
    const yearLabel = svg.append('text')
      .attr('y', height - margin.bottom / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px');

    // Create a title for the chart
    const title = svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .text('The Cost of Clothing Relative to Median Annual Wage');

    // Function to update the shirt size and year label based on the current year
    function update(year) {
      const sizeRow = data.find(d => Math.floor(d.YEAR) === Math.floor(year));
      if (sizeRow) {
        const shirtSize = sizeScale(sizeRow.SIZE);
        shirt.attr('width', shirtSize).attr('height', shirtSize);
        shirt.attr('x', xScale(sizeRow.YEAR) - shirtSize / 2);
      }
      yearLabel.text(`Year: ${Math.floor(year)}`);
      yearLabel.attr('x', button.datum().x);

      // Call the function to update the mini-shirt icon
      updateMiniShirtIcon();
    }

    // Create the drag behavior
    const drag = d3.drag()
      .on('drag', function (event, d) {
        d.x = Math.max(margin.left, Math.min(width - margin.right, event.x));
        d3.select(this).attr('cx', d.x);
        const year = xScale.invert(d.x);
        update(year);
        yearLabel.attr('x', d.x);
      });

    // Draw the button
    const button = svg.append('circle')
      .datum({ x: width / 2 + 100 }) // Shifted the button to the right by 100
      .attr('class', 'button')
      .attr('cx', d => d.x)
      .attr('cy', margin.top)
      .attr('r', 8)
      .call(drag);

    // Initial update
    const initialYear = xScale.invert(button.datum().x);
    update(initialYear);
    yearLabel.attr('x', button.datum().x);

    // Variable to track if the shirt icon is selected
    let shirtSelected = false;

    // Function to toggle the shirt icon on and off
    function toggleShirtIcon() {
      const miniShirt = d3.select('#mini-shirt');
      if (shirtSelected) {
        miniShirt.classed('selected', false);
      } else {
        miniShirt.classed('selected', true);
      }
      shirtSelected = !shirtSelected;
    }

    // Update the mini-shirt icon appearance
    function updateMiniShirtIcon() {
      const miniShirt = d3.select('#mini-shirt');
      miniShirt.classed('selected', shirtSelected);
    }
});
