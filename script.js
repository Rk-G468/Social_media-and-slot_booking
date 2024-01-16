const container = document.querySelector('.container')
const movieSelect = document.getElementById('movie')

var ticketPricee = + movieSelect.value

function updateCost() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected')

    var finalCost = document.getElementById('finalCast');
    var cost = document.getElementById('cost');

    if (finalCost && cost) {
        finalCost.style.display = "block";
        finalCost.style.visibility = "visible";

        const selectedSeatsCount = selectedSeats.length;
        cost.innerText = "The total cost is Rs." + selectedSeatsCount * ticketPricee;
    } else {
        console.error("Elements not found: 'finalCost' or 'cost'");
    }
}


movieSelect.addEventListener('change', (e) => {

    var screenNo = e.target.selectedIndex + 1
    var selectedScreen = "screen" + screenNo

    var screen1 = document.getElementById('screen1')
    var screen2 = document.getElementById('screen2')
    var screen3 = document.getElementById('screen3')





    if (screenNo === 1) {
       




        screen1.style.display = "flex"
        screen1.style.visibility = "visible"

        screen2.style.display = "none"
        screen2.style.visibility = "hidden"

        screen3.style.display = "none"
        screen3.style.visibility = "hidden"



    }
    else if (screenNo === 2) {
       


        screen2.style.display = "flex"
        screen2.style.visibility = "visible"

        screen1.style.display = "none"
        screen1.style.visibility = "hidden"

        screen3.style.display = "none"
        screen3.style.visibility = "hidden"

    }
    else if (screenNo === 3) {

        


        screen3.style.display = "flex"
        screen3.style.visibility = "visible"

        screen2.style.display = "none"
        screen2.style.visibility = "hidden"

        screen1.style.display = "none"
        screen1.style.visibility = "hidden"

    }

    ticketPricee = +e.target.value
    updateCost()

})

container.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected')
        updateCost()
    }


});

updateCost()
