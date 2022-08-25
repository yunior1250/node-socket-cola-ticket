//referencia html

const lbnlEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblticket = document.querySelector('small');
const divAlerrta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');



const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('el escritorio es obligatodio')
}


const escritorio = searchParams.get('escritorio');
lbnlEscritorio.innerText = escritorio;
divAlerrta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {
    if (pendientes === 0) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }
    lblPendientes.innerText = pendientes;
    // console.log(pendientes);
    // lblNuevoTicket.innerText = 'Ticket ' + ultimo;
})

btnAtender.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg }) => {
        //console.log(payload);
        if (!ok) {
            lblticket.innerText = 'Nadie ';
            return divAlerrta.style.display = '';
        }

        lblticket.innerText = 'Tikect ' + ticket.numero



    });
    //socket.emit('siguiente-ticket', null, (ticket) => {
    //console.log('Desde el server', ticket);
    //  lblNuevoTicket.innerText = ticket;
    //  });
});