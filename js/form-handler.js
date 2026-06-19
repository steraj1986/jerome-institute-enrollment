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

    /**
     * Save enrollment data to Firebase Realtime Database
     * Data is stored under 'enrollments' with unique timestamps as keys
     */
    function saveEnrollmentToFirebase(data) {
        // Check if Firebase is initialized
        if (typeof firebase === 'undefined') {
            console.error('Firebase is not initialized. Please check your Firebase configuration.');
            alert('Error: Firebase is not properly configured. Please contact support.');
            return;
        }

        // Get database reference
        const database = firebase.database();
        
        // Create a unique key based on email and timestamp
        const enrollmentKey = data.email + '_' + Date.now();
        
        // Save to Firebase under 'enrollments' node
        database.ref('enrollments/' + enrollmentKey).set(data)
            .then(() => {
                console.log('✓ Enrollment successfully saved to Firebase:', data);
                
                // Also save to localStorage as backup
                saveEnrollmentToLocalStorage(data);
            })
            .catch((error) => {
                console.error('✗ Error saving to Firebase:', error);
                alert('Error saving enrollment. Data has been saved locally. Please try again later.');
                
                // Save to localStorage as fallback
                saveEnrollmentToLocalStorage(data);
            });
    }

    /**
     * Backup: Save enrollment to localStorage
     */
    function saveEnrollmentToLocalStorage(data) {
        try {
            let enrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
            enrollments.push(data);
            localStorage.setItem('enrollments', JSON.stringify(enrollments));
            console.log('✓ Enrollment also saved to localStorage as backup');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Optional: Load and display all enrollments from Firebase
     * Uncomment to use this feature
     */
    /*
    function loadEnrollmentsFromFirebase() {
        const database = firebase.database();
        
        database.ref('enrollments').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log('All Enrollments:', data);
                // You can update your UI here with the enrollments
            } else {
                console.log('No enrollments found');
            }
        });
    }

    // Call this function if you want to load enrollments on page load
    // loadEnrollmentsFromFirebase();
    */
});
