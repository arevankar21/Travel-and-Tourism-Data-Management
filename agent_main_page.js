document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');

    if (!paymentForm) {
        console.error('Payment form element not found.');
        return;
    }

    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const formData = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value,
            cardHolderName: document.getElementById('cardHolderName').value,
            amount: document.getElementById('amount').value
        };

        if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardHolderName) {
            console.error('Missing required fields:', formData);
            alert('Please fill out all fields.');
            return;
        }

        fetch('http://localhost:5500/api/createOrder', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: formData.amount }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(order => {
            console.log('Order created:', order);
            openRazorpayCheckout(order.id); 
        })
        .catch(error => {
            console.error('Error creating order:', error);
            alert('Order creation failed. Please try again.');
        });
    });

    function openRazorpayCheckout(orderId) {
        const options = {
            "key": "rzp_test_ybqxNC9dW5rcp0", 
            "amount": amount, 
            "currency": "INR",
            "name": "Akshay Revankar",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId, 
            "handler": function (response) {
                alert('Payment successful!');
                console.log('Payment ID:', response.razorpay_payment_id);
                console.log('Order ID:', response.razorpay_order_id);
                console.log('Signature:', response.razorpay_signature);
        
                fetch('http://localhost:5500/api/verifyPayment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert('Payment verification successful!');
                        window.location.href = 'confirmation.html';
                    } else {
                        alert('Payment verification failed!');
                    }
                })
                .catch(err => {
                    console.error('Error verifying payment:', err);
                    alert('Error verifying payment.');
                });
            },
            "prefill": {
                "name": document.getElementById('fullName').value,
                "email": document.getElementById('email').value,
                "contact": document.getElementById('mobileNumber').value
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();        
    }
});


function viewBookings() {
    const token = getToken(); 

    fetch('http://localhost:5500/api/bookings', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const bookingsContainer = document.getElementById('bookingsContainer');
        bookingsContainer.innerHTML = '';

        data.forEach(booking => {
            const bookingDiv = document.createElement('div');
            bookingDiv.classList.add('booking');

            
            const customerName = booking.customerName || 'Unknown';
            const hotelName = booking.hotelName || 'Unknown';
            const hotelAddress = booking.hotelAddress || 'Unknown';

            bookingDiv.innerHTML = `
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Customer Name:</strong> ${customerName}</p>
                <p><strong>Hotel Name:</strong> ${hotelName}</p>
                <p><strong>Hotel Address:</strong> ${hotelAddress}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Amount:</strong> $${booking.amount}</p>
                <!-- Add more details as needed -->
            `;
            bookingsContainer.appendChild(bookingDiv);
        });

        
        document.getElementById('totalBookings').textContent = data.length;
        document.getElementById('totalRevenue').textContent = calculateTotalRevenue(data);
    })
    .catch(error => {
        console.error('Error fetching bookings:', error);
    });
}

function getToken() {
    return localStorage.getItem('token'); 
}

function calculateTotalRevenue(bookings) {
    let totalRevenue = 0;
    bookings.forEach(booking => {
        totalRevenue += booking.amount || 0;
    });
    return totalRevenue;
}


function modifyBooking() {
    console.log('Opening modify booking form...');
}

function viewCustomers() {
    alert('Viewing customers...');
}

function searchCustomer() {
    alert('Searching customer...');
}

function manageInventory() {
    alert('Managing inventory...');
}

function generateReports() {
    alert('Generating reports...');
}

function sendEmail() {
    alert('Sending email...');
}

function editProfile() {
    alert('Editing profile...');
}

function changePassword() {
    alert('Changing password...');
}

function contactSupport() {
    alert('Contacting support...');
}
