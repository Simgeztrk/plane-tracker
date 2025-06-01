const fs = require('fs');
const path = require('path');

// eslint-disable-next-line no-undef
const dbPath = path.join(__dirname, 'database.json'); //(directory path) orjinal database
// eslint-disable-next-line no-undef
const originalDbPath = path.join(__dirname, 'originalDatabase.json'); //(directory path)

// Dünya yarıçapı ve hız ölçekleme sabiti
const EARTH_RADIUS_KM = 6371;
const SPEED_SCALE = 0.001;

// Sıfırlama sayaçları
let resetCounter = 0;
const RESET_INTERVAL = 60 * 20000; // (20 dakika)

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

function updatePlanes() {
  resetCounter += 500;

  if (resetCounter >= RESET_INTERVAL) {
    //eğer sayaç beklenen süreye ulaşmışsa
    fs.copyFileSync(originalDbPath, dbPath); // ✨ Kopyalama işlemi burada!
    resetCounter = 0;
    console.log('🔄 Veriler sıfırlandı (originalDatabase.json → database.json)');
    return;
  }

  // Uçakları oku
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  db.planes = db.planes.map((plane) => {
    // İlk yön belirleme
    if (!plane.heading && plane.heading !== 0) {
      plane.heading = Math.floor(Math.random() * 360);
    }

    // Zigzag efekti
    const headingChange = Math.random() * 10 - 5; // -5 ile +5 derece
    plane.heading = (plane.heading + headingChange + 360) % 360;

    const headingRad = toRadians(plane.heading);
    const distance = plane.speed * SPEED_SCALE;
    const delta = distance / EARTH_RADIUS_KM;

    const latRad = toRadians(plane.latitude);
    const lonRad = toRadians(plane.longitude);

    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(delta) + Math.cos(latRad) * Math.sin(delta) * Math.cos(headingRad)
    );

    const newLonRad =
      lonRad +
      Math.atan2(
        Math.sin(headingRad) * Math.sin(delta) * Math.cos(latRad),
        Math.cos(delta) - Math.sin(latRad) * Math.sin(newLatRad)
      );

    const newLat = toDegrees(newLatRad);
    const newLon = toDegrees(newLonRad);

    return {
      ...plane,
      latitude: newLat,
      longitude: newLon,
      speed: Math.max(700, Math.min(950, plane.speed + Math.floor(Math.random() * 20 - 10))),
      altitude: Math.max(
        9000,
        Math.min(12000, plane.altitude + Math.floor(Math.random() * 100 - 50))
      ),
      heading: plane.heading,
    };
  });

  // Güncellenmiş veriyi yaz
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  console.log('🌀 Uçaklar rastgele saparak ilerliyor...');
}

// Her 500 ms'de bir updatePlanes çağrılıyor
setInterval(updatePlanes, 500);
