
const hotelSystem = require('../src/hotelSystem');
const assert = (cond, msg) => { if (!cond) throw new Error(msg); }

const hotel = hotelSystem(4);
hotel.addReservation({ id: 'r1', name: 'A', checkIn: '10/10', checkOut: '12/10', roomNumber: 1 });
hotel.addReservation({ id: 'r2', name: 'B', checkIn: '12/10', checkOut: '14/10', roomNumber: 1 });

assert(hotel.getReservations().length === 2, 'debe tener 2 reservas');
assert(hotel.getAvailableRooms('11/10','11/10').length === 3, 'habitaciones disponibles incorrectas');
try {
  hotel.addReservation({ id: 'r3', name: 'C', checkIn: '11/10', checkOut: '13/10', roomNumber: 1 });
  throw new Error('debería haber lanzado conflicto');
} catch(e) {
  if (e.message !== 'La habitación no está disponible') throw e;
}

console.log('Tests simples OK');
