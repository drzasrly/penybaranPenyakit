// Inisialisasi peta menggunakan Leaflet.js
//const map = L.map('map').setView([-2.5489, 118.0149], 5); // Fokus pada Indonesia
const map = L.map('map').setView([-7.2575, 112.7521], 10); // Fokus pada Surabaya

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const cityMarkers = dataPenyakit.map(entry => {
    const marker = L.circle(entry.koordinat, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 0 // Dimulai dari radius 0
    }).addTo(map);

    marker.bindPopup(`<b>${entry.nama}</b><br>Susceptible: ${entry.S}<br>Infected: ${entry.I}<br>Recovered: ${entry.R}`);
    return { entry, marker };
});

function updateMap(data, iteration) {
    data.forEach((entry, index) => {
        const kasusInfected = (entry.kasus[iteration] && entry.kasus[iteration].I) || 0;

        const radius = Math.sqrt(kasusInfected) * 100; // Radius sesuai skala kasus
        cityMarkers[index].marker.setRadius(radius);

        cityMarkers[index].marker.bindPopup(`
            <b>${entry.nama}</b><br>
            Susceptible: ${Math.round(entry.kasus[iteration]?.S || 0)}<br>
            Infected: ${Math.round(kasusInfected)}<br>
            Recovered: ${Math.round(entry.kasus[iteration]?.R || 0)}
        `);
    });
}

function animateMap() {
    let iteration = 0;

    const interval = setInterval(() => {
        if (iteration >= maxIterations) {
            clearInterval(interval);
        } else {
            updateMap(dataPenyakit, iteration);
            iteration++;
        }
    }, 1000); // Perbarui setiap 1 detik
}

animateMap();