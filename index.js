// index.js - ejemplo de uso de hotelSystem
const hotelSystem = require('./src/hotelSystem');

// creamos hotel con 4 habitaciones (1..4)
const hotel = hotelSystem(4);

// añadir reservas de ejemplo
try {
  hotel.addReservation({ id: 'r1', name: 'Ana Pérez', checkIn: '10/10', checkOut: '12/10', roomNumber: 1 });
  hotel.addReservation({ id: 'r2', name: 'Carlos Ruiz', checkIn: '11/10', checkOut: '14/10', roomNumber: 3 });
} catch (e) {
  console.error('Error de ejemplo:', e.message);
}

console.log('--- Reservas actuales ---');
console.log(hotel.getReservations());

console.log('\\n--- Buscar r1 ---');
console.log(hotel.searchReservation('r1'));

console.log('\\n--- Reservas ordenadas por checkIn ---');
console.log(hotel.getSortReservations());

console.log('\\n--- Habitaciones disponibles 11/10 - 12/10 ---');
console.log(hotel.getAvailableRooms('11/10', '12/10'));

console.log('\\n--- Intento añadir conflicto (misma habitación y fechas) ---');
try {
  hotel.addReservation({ id: 'r3', name: 'Pedro', checkIn: '11/10', checkOut: '12/10', roomNumber: 1 });
} catch (e) {
  console.error('Error:', e.message);
}

console.log('\\n--- Eliminar r2 ---');
console.log(hotel.removeReservation('r2'));
console.log('Reservas finales:', hotel.getReservations());