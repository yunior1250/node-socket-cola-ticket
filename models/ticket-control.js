const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];
        this.init();
    }

    get toJSON() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init() {
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json');
        //console.log(data);
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            //es otro dia
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJSON))
    }

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);


        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }
    atenderticket(escritorio) {
        //no tenemos tickets 
        if (this.tickets.length === 0) {
            return null;
        }
        //sacamos el ticket de tickes
        const ticket = this.tickets[0];//this.tickets.shift();
        //borrar 
        this.tickets.shift();
        ticket.escritorio = escritorio;
        //a;adir a laos ultimos 4 para desplegar ala apantalla
        //a;adir un elemeto al princio al arefglo "unshift"
        this.ultimos4.unshift(ticket);
        //verificar que sean cualtro o se llnen 4
        if (this.ultimos4.length > 4) {
            //borrar el ultimo 
            this.ultimos4.splice(-1, 1);
        }
        this.guardarDB();
        return ticket;
    }
}
module.exports = TicketControl;