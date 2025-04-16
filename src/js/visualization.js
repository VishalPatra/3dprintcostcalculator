import { mountains } from './mountains.js';

export class MountainVisualization {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.margin = { top: 40, right: 40, bottom: 40, left: 40 };
        this.svg = null;
        this.projection = null;
        this.activeElement = null;
    }

    init() {
        const container = document.getElementById('mountain-viz');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        // Create SVG
        this.svg = d3.select('#mountain-viz')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Create projection
        this.projection = d3.geoMercator()
            .center([85, 28]) // Centered on Himalayan region
            .scale(1000)
            .translate([this.width / 2, this.height / 2]);

        // Create path generator
        const path = d3.geoPath().projection(this.projection);

        // Load world map data
        d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(worldData => {
                // Draw map
                this.svg.append('g')
                    .selectAll('path')
                    .data(worldData.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .style('fill', '#2d3436')
                    .style('stroke', '#636e72')
                    .style('stroke-width', '0.5px');

                // Add mountains
                const mountainGroups = this.svg.append('g')
                    .selectAll('g')
                    .data(mountains)
                    .enter()
                    .append('g')
                    .attr('transform', d => {
                        const [x, y] = this.projection(d.coordinates);
                        return `translate(${x},${y})`;
                    });

                // Add mountain markers
                mountainGroups.append('circle')
                    .attr('r', 8)
                    .attr('class', 'mountain-marker')
                    .style('fill', '#2ecc71')
                    .style('stroke', '#fff')
                    .style('stroke-width', '2px')
                    .style('cursor', 'pointer')
                    .on('mouseover', (event, d) => {
                        d3.select(event.currentTarget)
                            .transition()
                            .duration(200)
                            .attr('r', 12)
                            .style('fill', '#3498db');
                    })
                    .on('mouseout', (event, d) => {
                        if (event.currentTarget !== this.activeElement) {
                            d3.select(event.currentTarget)
                                .transition()
                                .duration(200)
                                .attr('r', 8)
                                .style('fill', '#2ecc71');
                        }
                    })
                    .on('click', (event, d) => {
                        if (this.activeElement) {
                            d3.select(this.activeElement)
                                .transition()
                                .duration(200)
                                .attr('r', 8)
                                .style('fill', '#2ecc71');
                        }
                        this.activeElement = event.currentTarget;
                        d3.select(this.activeElement)
                            .transition()
                            .duration(200)
                            .attr('r', 12)
                            .style('fill', '#3498db');
                        this.showMountainInfo(d);
                    });

                // Add mountain labels
                mountainGroups.append('text')
                    .attr('x', 12)
                    .attr('y', 4)
                    .text(d => d.name)
                    .style('fill', '#fff')
                    .style('font-size', '12px')
                    .style('text-shadow', '2px 2px 4px rgba(0,0,0,0.5)');
            });

        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = document.getElementById('mountain-viz');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height);

        this.projection
            .translate([this.width / 2, this.height / 2]);

        // Update mountain positions...
    }

    showMountainInfo(mountain) {
        const infoContent = document.querySelector('.info-content');
        infoContent.innerHTML = `
            <h3>${mountain.name}</h3>
            <div class="mountain-details">
                <div class="details">
                    <p><strong>Height:</strong> ${mountain.height}m</p>
                    <p><strong>Location:</strong> ${mountain.location}</p>
                    <p><strong>Range:</strong> ${mountain.range}</p>
                    <p><strong>First Ascent:</strong> ${mountain.firstAscent}</p>
                    <p><strong>First Ascent Team:</strong> ${mountain.firstAscentTeam}</p>
                </div>
            </div>
            <p class="description">${mountain.description}</p>
        `;
    }
} 