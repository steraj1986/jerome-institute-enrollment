document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enrollmentForm');
    const successMessage = document.getElementById('successMessage');

    // Log to confirm form is found
    console.log('Form found:', form);

    if (!form) {
        console.error('Form with id "enrollmentForm" not found!');
        return;
    }

    form.addEventListener('submit', function(e) {
        console.log('Form submit event triggered');
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            console.warn('Form validation failed');
            return;
        }

        console.log('Form validation passed');

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

        console.log('Collected form data:', data);

        // Save to Firebase
        saveEnrollmentToFirebase(data);

        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';

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
        let errorFields = [];

        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            
            if (!element) {
                console.warn(`Field with id "${field}" not found in HTML`);
                return;
            }

            const value = element.type === 'checkbox' ? element.checked : element.value.trim();

            if (!value) {
                element.classList.add('error');
                errorFields.push(field);
                isValid = false;
            } else {
                element.classList.remove('error');
            }
        });

        // Validate email format
        const email = document.getElementById('email');
        if (email && email.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('error');
                alert('Please enter a valid email address');
                isValid = false;
            }
        }

        if (errorFields.length > 0) {
            console.warn('Validation errors in fields:', errorFields);
        }

        return isValid;
    }

    /**
     * Save enrollment data to Firebase Realtime Database
     */
    function saveEnrollmentToFirebase(data) {
        console.log('Attempting to save to Firebase...');
        
        // Check if Firebase is initialized
        if (typeof firebase === 'undefined') {
            console.error('Firebase is not initialized');
            alert('Error: Firebase not initialized. Saving locally only.');
            saveEnrollmentToLocalStorage(data);
            return;
        }

        try {
            const database = firebase.database();
            const enrollmentKey = data.email + '_' + Date.now();
            
            console.log('Saving to Firebase with key:', enrollmentKey);

            database.ref('enrollments/' + enrollmentKey).set(data)
                .then(() => {
                    console.log('✓ Successfully saved to Firebase');
                    saveEnrollmentToLocalStorage(data);
                })
                .catch((error) => {
                    console.error('Firebase error:', error);
                    alert('Data saved locally (Firebase connection failed)');
                    saveEnrollmentToLocalStorage(data);
                });
        } catch (error) {
            console.error('Error in saveEnrollmentToFirebase:', error);
            saveEnrollmentToLocalStorage(data);
        }
    }

    /**
     * Save enrollment to localStorage as backup
     */
    function saveEnrollmentToLocalStorage(data) {
        try {
            let enrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
            enrollments.push(data);
            localStorage.setItem('enrollments', JSON.stringify(enrollments));
            console.log('✓ Saved to localStorage. Total enrollments:', enrollments.length);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
});
