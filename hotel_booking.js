document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const location = document.getElementById('location').value.trim().toLowerCase();

    const hotels = [
        {
            name: 'Holiday Inn Resort Goa',
            address: 'Mobor Beach Cavelossim Salcete, Goa 403731 India',
            price: '8,729 INR per night',
            image: 'https://digital.ihg.com/is/image/ihg/holiday-inn-resort-goa-6145685426-4x3?wid=750&fit=constrain',
            location: 'goa'
        },
        {
            name: 'The Leela Goa',
            address: 'Mobor Beach, Cavelossim, Goa 403731, India',
            price: '16,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'goa'
        },
        {
            name: 'ITC Gardenia, Bengaluru',
            address: 'No.1, Residency Road, Ashok Nagar, Bengaluru, Karnataka 560025, India',
            price: '13,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'bengaluru'
        },
        {
            name: 'Hotel Paradise',
            address: '456 Downtown, Bengaluru',
            price: '16,500 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'bengaluru'
        },
        {
            name: 'Hotel Bliss',
            address: '789 Hilltop, Manali',
            price: '12,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'manali'
        },
        {
            name: 'The Taj Mahal Palace',
            address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001',
            price: '20,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'mumbai'
        },
        {
            name: 'Trident, Nariman Point',
            address: 'Nariman Point, Mumbai, Maharashtra 400021',
            price: '12,500 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'mumbai'
        },
        {
            name: 'Ramada by Wyndham Ayodhya',
            address: 'New Railway Station Road, Sahadatganj, Ayodhya, Uttar Pradesh 224123, India',
            price: '7,500 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'ayodhya'
        },
        {
            name: 'Hotel Panchsheel',
            address: 'Faizabad Road, Civil Lines, Ayodhya, Uttar Pradesh 224001, India',
            price: '5,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'ayodhya'
        },
        {
            name: 'Taj Coromandel, Chennai',
            address: '37, Mahatma Gandhi Road, Nungambakkam, Chennai, Tamil Nadu 600034, India',
            price: '13,500 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'chennai'
        },
        {
            name: 'ITC Grand Chola, Chennai',
            address: 'No. 63, Mount Road, Guindy, Chennai, Tamil Nadu 600032, India',
            price: '14,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'chennai'
        },
        {
            name: 'Kumarakom Lake Resort',
            address: 'Kumarakom North Post, Kottayam, Kerala 686566, India',
            price: '12,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'kerala'
        },
        {
            name: 'The Raviz Resort and Spa, Ashtamudi',
            address: 'Thevally, Mathilil PO, Kollam, Kerala 691601, India',
            price: '10,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'kerala'
        },
        {
            name: 'ITC Kohenur, Hyderabad',
            address: ' Plot No. 5, Hyderabad Knowledge City, Madhapur, Hyderabad, Telangana 500081, India',
            price: '15,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'hyderabad'
        },
        {
            name: 'Taj Falaknuma Palace, Hyderabad',
            address: 'Engine Bowli, Falaknuma, Hyderabad, Telangana 500053, India',
            price: '25,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'hyderabad'
        },
        {
            name: 'The Leela Palace New Delhi',
            address: 'Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110023, India',
            price: '18,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'delhi'
        },
        {
            name: 'The Oberoi, New Delhi',
            address: 'Dr. Zakir Hussain Marg, New Delhi, Delhi 110003, India',
            price: '20,500 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'delhi'
        },
        {
            name: 'The Leela Palace Bangalore',
            address: '23, HAL Airport Road, Bengaluru, Karnataka 560008, India',
            price: '15,000 INR per night',
            image: 'https://via.placeholder.com/150',
            location: 'bengaluru'
        }
    ];

    const filteredHotels = hotels.filter(hotel => hotel.location === location);

    if (filteredHotels.length > 0) {
        const hotelListContainer = document.getElementById('hotelList');
        hotelListContainer.innerHTML = '';

        const hotelList = document.createElement('ul');
        hotelList.className = 'hotel-list';

        filteredHotels.forEach(hotel => {
            const hotelItem = document.createElement('li');
            hotelItem.innerHTML = `
                <div class="hotel-item">
                    <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image">
                    <div class="hotel-details">
                        <h3>${hotel.name}</h3>
                        <p>${hotel.address}</p>
                        <p>Price: ${hotel.price}</p>
                        <button class="book-btn" data-hotel="${hotel.name}">Book Now</button>
                    </div>
                </div>
            `;
            hotelList.appendChild(hotelItem);
        });

        hotelListContainer.appendChild(hotelList);

        const bookButtons = document.querySelectorAll('.book-btn');
        bookButtons.forEach(button => {
            button.addEventListener('click', function() {
                const selectedHotelName = this.getAttribute('data-hotel');
                const selectedHotel = filteredHotels.find(hotel => hotel.name === selectedHotelName);

                if (selectedHotel) {
                    window.location.href = `booking.html?hotelName=${encodeURIComponent(selectedHotel.name)}&hotelAddress=${encodeURIComponent(selectedHotel.address)}&hotelPrice=${encodeURIComponent(selectedHotel.price)}`;
                } else {
                    alert('Hotel not found. Please try again.');
                }
            });
        });
    } else {
        alert('No hotels found for the specified location.');
    }
});
