const beta = 0.3; // Tingkat penularan
const gamma = 0.1; // Tingkat penyembuhan
const maxIterations = 200; // Batas maksimum iterasi
const threshold = 1e-3; // Ambang batas untuk menghentikan iterasi

function simulateSpread(data) {
    data.forEach(city => {
        let { S, I, R } = city;
        let iteration = 0;

        while (I > threshold && iteration < maxIterations) {
            const dS = -beta * S * I / (S + I + R);
            const dI = beta * S * I / (S + I + R) - gamma * I;
            const dR = gamma * I;

            S += dS;
            I += dI;
            R += dR;

            city.kasus.push({ S: Math.round(S), I: Math.round(I), R: Math.round(R) });

            iteration++;
        }
    });
}

simulateSpread(dataPenyakit);

console.log(dataPenyakit);

function renderChart(data) {
    const ctx = document.getElementById('chart').getContext('2d');
    const labels = Array.from({ length: maxIterations }, (_, i) => `Day ${i + 1}`);
    const datasets = [];

    data.forEach(entry => {
        datasets.push({
            label: `${entry.nama} - Infected`,
            data: entry.kasus.map(k => k.I),
            borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            fill: false
        });
        datasets.push({
            label: `${entry.nama} - Susceptible`,
            data: entry.kasus.map(k => k.S),
            borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            borderDash: [5, 5],
            fill: false
        });
        datasets.push({
            label: `${entry.nama} - Recovered`,
            data: entry.kasus.map(k => k.R),
            borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            borderDash: [2, 2],
            fill: false
        });
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Population'
                    }
                }
            }
        }
    });
}

const chartContainer = document.createElement('div');
chartContainer.innerHTML = '<canvas id="chart" width="800" height="400"></canvas>';
document.body.appendChild(chartContainer);

renderChart(dataPenyakit);