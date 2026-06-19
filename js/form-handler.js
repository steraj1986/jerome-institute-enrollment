document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enrollmentForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dob: formData.get('dob'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            program: formData.get('program'),
            degree: formData.get('degree'),
            gpa: formData.get('gpa'),
            enrollmentTerm: formData.get('enrollment'),
            international: formData.get('international') ? 'Yes' : 'No',
            essay: formData.get('essay'),
            submittedAt: new Date().toISOString()
        };

        // Save to localStorage (for demonstration)
        saveEnrollment(data);

        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Optional: Send to backend API
        // sendToBackend(data);

        // Reset after 3 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
        }, 3000);
    });

    function validateForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'dob', 
                              'address', 'city', 'state', 'zip', 'program', 
                              'degree', 'enrollment', 'essay', 'terms'];
        
        let isValid = true;

        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                element.classList.add('error');
                isValid = false;
            } else {
                element.classList.remove('error');
            }
        });

        // Validate email format
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('error');
            alert('Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    function saveEnrollment(data) {
        let enrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
        enrollments.push(data);
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        console.log('Enrollment saved:', data);
    }

    // Optional: Uncomment to send data to backend
    /*
    function sendToBackend(data) {
        fetch('/api/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    }
    */
});