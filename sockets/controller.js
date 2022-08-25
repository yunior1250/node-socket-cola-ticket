
const TicketControl = require('../models/ticket-control');


const ticketControl = new TicketControl();

const socketController = (socket) => {
    //cuando un cliente es econecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);



    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
        //TODO : notificar que hay un nuevo ticket pendiente asignar 
    })
    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'Es escritorio es obligatorio'
            })
        }
        const ticket = ticketControl.atenderticket(escritorio);
        //TODO : Notificar cambio  enlosultimos 4 
        socket.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);//por que los ultimos 4 cambiaron y hay que notificar

        if (!ticket) {
            callback({
                ok: false,
                msg: 'ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    })
}

module.exports = {
    socketController
}

