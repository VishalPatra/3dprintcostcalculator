import { mountains } from './mountains.js';

export class MountainMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.activeMarker = null;
    }

    init() {
        // Initialize Leaflet map
        this.map = L.map('map').setView([28, 85], 5);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add terrain layer (optional)
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors'
        }).addTo(this.map);

        this.addMarkers();
    }

    addMarkers() {
        mountains.forEach(mountain => {
            // Create custom icon
            const icon = L.divIcon({
                className: 'mountain-marker',
                html: `<div class="marker-inner"></div>`,
                iconSize: [20, 20]
            });

            // Create marker
            const marker = L.marker(mountain.coordinates.reverse(), {
                icon: icon
            }).addTo(this.map);

            // Create popup
            const popupContent = `<h3>${mountain.name}</h3><p>${mountain.height}m</p>`;
            marker.bindPopup(popupContent);

            // Add click event
            marker.on('click', () => {
                this.showMountainInfo(mountain);
                if (this.activeMarker) {
                    this.activeMarker.classList.remove('active');
                }
                marker.getElement().querySelector('.marker-inner').classList.add('active');
                this.activeMarker = marker.getElement().querySelector('.marker-inner');
            });

            this.markers.push(marker);
        });
    }

    showMountainInfo(mountain) {
        const infoContent = document.querySelector('.info-content');
        infoContent.innerHTML = `
            <h3>${mountain.name}</h3>
            <div class="mountain-details">
                <img src="${mountain.image}" alt="${mountain.name}">
                <div class="details">
                    <p><strong>Height:</strong> ${mountain.height}m</p>
                    <p><strong>Location:</strong> ${mountain.location}</p>
                    <p><strong>First Ascent:</strong> ${mountain.firstAscent}</p>
                    <p><strong>First Ascent Team:</strong> ${mountain.firstAscentTeam}</p>
                </div>
            </div>
            <p class="description">${mountain.description}</p>
        `;
    }
} 