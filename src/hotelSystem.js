// hotelSystem.js
// Implementación simple y didáctica de hotelSystem(rooms)
// rooms: número total de habitaciones (ej. 10) o array de números de habitación (ej. [1,2,3])
// Retorna un objeto con las operaciones requeridas.

function parseDateDM(dateStr) {
  // espera "dd/mm" o "dd/mm/yyyy". Si no hay año, usa 2025 como año por defecto.
  const parts = dateStr.split('/');
  if (parts.length === 2) {
    const [d, m] = parts.map(Number);
    return new Date(2025, m - 1, d);
  } else {
    const [d, m, y] = parts.map(Number);
    return new Date(y, m - 1, d);
  }
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  // tratamos checkOut como exclusivo: una reserva que sale el mismo día que otra entra no se solapa.
  return aStart < bEnd && bStart < aEnd;
}

function hotelSystem(roomsInput) {
  // normalizar habitaciones a array de números
  let rooms;
  if (Array.isArray(roomsInput)) {
    rooms = roomsInput.slice();
  } else if (typeof roomsInput === 'number') {
    rooms = Array.from({length: roomsInput}, (_, i) => i + 1);
  } else {
    throw new Error('rooms debe ser un número o un array de números de habitación');
  }

  // reservas internas (cada reserva: { id, name, checkIn: "dd/mm", checkOut: "dd/mm", roomNumber })
  const reservations = [];

  // 1. searchReservation(id)
  function searchReservation(id) {
    const found = reservations.find(r => r.id === id);
    if (!found) throw new Error('La reservación no fue encontrada');
    // devolver copia para no exponer internals
    return Object.assign({}, found);
  }

  // 2. getSortReservations()
  function getSortReservations() {
    // devolver copia ordenada por fecha de checkIn ascendente
    return reservations
      .slice() // copia superficial
      .sort((a, b) => parseDateDM(a.checkIn) - parseDateDM(b.checkIn))
      .map(r => Object.assign({}, r));
  }

  // 3. addReservation(reservation)
  function addReservation(reservation) {
    // validar campos mínimos
    const { id, name, checkIn, checkOut, roomNumber } = reservation || {};
    if (!id || !name || !checkIn || !checkOut || !roomNumber) {
      throw new Error('Reserva inválida: faltan campos requeridos');
    }
    // verificar que la habitación exista en el hotel
    if (!rooms.includes(roomNumber)) throw new Error('La habitación no existe en el hotel');

    const newIn = parseDateDM(checkIn);
    const newOut = parseDateDM(checkOut);
    if (!(newIn < newOut)) throw new Error('Fechas inválidas: checkIn debe ser anterior a checkOut');

    // comprobar conflicto con reservas existentes en la misma habitación
    const conflict = reservations.some(r => {
      if (r.roomNumber !== roomNumber) return false;
      const rIn = parseDateDM(r.checkIn);
      const rOut = parseDateDM(r.checkOut);
      return rangesOverlap(rIn, rOut, newIn, newOut);
    });

    if (conflict) throw new Error('La habitación no está disponible');

    // añadir reserva (guardar copia para evitar referencias externas)
    const toSave = { id, name, checkIn, checkOut, roomNumber };
    reservations.push(toSave);
    return Object.assign({}, toSave);
  }

  // 4. removeReservation(id)
  function removeReservation(id) {
    const idx = reservations.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('La reservación que se busca remover no existe');
    const removed = reservations.splice(idx, 1)[0];
    return Object.assign({}, removed);
  }

  // 5. getReservations()
  function getReservations() {
    return reservations.slice().map(r => Object.assign({}, r));
  }

  // 6. getAvailableRooms(checkIn, checkOut)
  function getAvailableRooms(checkIn, checkOut) {
    const inDate = parseDateDM(checkIn);
    const outDate = parseDateDM(checkOut);
    if (!(inDate < outDate)) throw new Error('Fechas inválidas: checkIn debe ser anterior a checkOut');

    // habitaciones ocupadas en el rango
    const occupied = reservations
      .filter(r => {
        const rIn = parseDateDM(r.checkIn);
        const rOut = parseDateDM(r.checkOut);
        return rangesOverlap(rIn, rOut, inDate, outDate);
      })
      .map(r => r.roomNumber);

    // disponible = rooms - occupied
    return rooms.filter(rn => !occupied.includes(rn));
  }

  return {
    searchReservation,
    getSortReservations,
    addReservation,
    removeReservation,
    getReservations,
    getAvailableRooms,
    // expongo internals para pruebas si hace falta (pero como copia)
    _rooms: rooms.slice(),
    _reservations: () => reservations.slice()
  };
}

module.exports = hotelSystem;