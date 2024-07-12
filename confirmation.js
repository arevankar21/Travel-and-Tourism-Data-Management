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
            cardHolderName: document.getElementById('cardHolderName').value
        };

        
        fetch('http://localhost:5500/api/processPayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Payment successful:', data); 
            alert('Payment successful!'); 
            
        })
        .catch(error => {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
        });
    });
});
