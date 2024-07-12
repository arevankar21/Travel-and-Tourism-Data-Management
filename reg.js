function getHotelsByPlace(place) {
    var hotelsData = [
        { name: "Hotel Cartier Biznotel", address: "Jai Muniro Circle, 39.39, 8th Cross Rd,Agrahara Dasarahalli , Bengaluru", location: "Bengaluru" },
        { name: "Sri Krishna International hotel", address: "near Havanoor circle, 3rd stage, 4th block,west of chord road, Basaveshwara Nagara", location: "Bengaluru" },
        { name: "Hotel C", address: "Address C", location: "Place C" }
     
    ];


    var hotelsInPlace = hotelsData.filter(hotel => hotel.location.toLowerCase() === place.toLowerCase());

    return hotelsInPlace;
}



function decrement(id) {
    var element = document.getElementById(id);
    var value = parseInt(element.innerText);
    if (value > 0) {
        element.innerText = value - 1;
    }
    updateMembersInput();
}


function increment(id) {
    var element = document.getElementById(id);
    var value = parseInt(element.innerText);
    element.innerText = value + 1;
    updateMembersInput();
}


function updateMembersInput() {
    var adults = document.getElementById('adults').innerText;
    var child = document.getElementById('child').innerText;
    var room = document.getElementById('room').innerText;
    var input = document.querySelector('.member input');
    input.value = `Adults: ${adults}, Children: ${child}, Rooms: ${room}`;
}


function showSearchResults() {
    var place = document.getElementById('place').value;
    var date = document.getElementById('date').value;
    var member = document.getElementById('member').value;

    
    if (!place || !date) {
        alert('Please enter both place and date.');
        return;
    }

    var hotels = getHotelsByPlace(place);
    var resultsDiv = document.getElementById('results');

    if (hotels.length === 0) {
        resultsDiv.innerHTML = `<p>No hotels found for the specified location.</p>`;
        return;
    }

    
    var hotelsList = hotels.map(hotel => `<li>${hotel.name} - ${hotel.address}</li>`).join('');
    resultsDiv.innerHTML = `
    <p><strong>Place:</strong> ${place}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Members:</strong> ${member}</p>
    <ul>${hotelsList}</ul>
  `;
}
