document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enrollmentForm');
    const successMessage = document.getElementById('successMessage');

    // Log to confirm form is found
    console.log('✓ Form script loaded');
    console.log('Form found:', form);

    if (!form) {
        console.error('❌ Form with id "enrollmentForm" not found!');
        return;
    }

    form.addEventListener('submit', function(e) {
        console.log('✓ Form submit event triggered');
        e.preventDefault();

        // Validate form
        const isValid = validateForm();
        console.log('Form validation result:', isValid);
        
        if (!isValid) {
            console.warn('❌ Form validation failed - check console for errors');
            alert('Please fill in all required fields correctly');
            return;
        }

        console.log('✓ Form validation passed');

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

        console.log('✓ Collected form data:', data);

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
        const requiredFields = [
            { id: 'firstName', type: 'text' },
            { id: 'lastName', type: 'text' },
            { id: 'email', type: 'email' },
            { id: 'phone', type: 'tel' },
            { id: 'dob', type: 'date' },
            { id: 'address', type: 'text' },
            { id: 'city', type: 'text' },
            { id: 'state', type: 'text' },
            { id: 'zip', type: 'text' },
            { id: 'program', type: 'select' },
            { id: 'degree', type: 'select' },
            { id: 'enrollment', type: 'select' },
            { id: 'essay', type: 'textarea' },
            { id: 'terms', type: 'checkbox' }
        ];
        
        let isValid = true;
        const errorFields = [];

        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            
            if (!element) {
                console.warn(`⚠️ Field with id "${field.id}" not found in HTML`);
                errorFields.push(field.id);
                return;
            }

            let value;
            if (field.type === 'checkbox') {
                value = element.checked;
            } else {
                value = element.value ? element.value.trim() : '';
            }

            if (!value) {
                element.classList.add('error');
                console.warn(`⚠️ Empty field: ${field.id}`);
                errorFields.push(field.id);
                isValid = false;
            } else {
                element.classList.remove('error');
                console.log(`✓ Valid field: ${field.id} = ${value.substring(0, 20)}`);
            }
        });

        // Validate email format
        const email = document.getElementById('email');
        if (email && email.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('error');
                console.error(`❌ Invalid email format: ${email.value}`);
                isValid = false;
            }
        }

        if (errorFields.length > 0) {
            console.warn('❌ Validation errors in fields:', errorFields);
            alert(`Please fill in these fields: ${errorFields.join(', ')}`);
        }

        return isValid;
    }

    /**
     * Save enrollment data to Firebase Realtime Database
     */
    function saveEnrollmentToFirebase(data) {
        console.log('🔄 Attempting to save to Firebase...');
        
        // Check if Firebase is initialized
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase is not initialized');
            alert('Firebase not available. Saving locally.');
            saveEnrollmentToLocalStorage(data);
            return;
        }

        try {
            const database = firebase.database();
            const enrollmentKey = data.email + '_' + Date.now();
            
            console.log('Saving to Firebase with key:', enrollmentKey);

            database.ref('enrollments/' + enrollmentKey).set(data)
                .then(() => {
                    console.log('✅ Successfully saved to Firebase');
                    saveEnrollmentToLocalStorage(data);
                })
                .catch((error) => {
                    console.error('❌ Firebase error:', error);
                    console.warn('Falling back to localStorage');
                    saveEnrollmentToLocalStorage(data);
                });
        } catch (error) {
            console.error('❌ Error in saveEnrollmentToFirebase:', error);
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
            console.log('✅ Saved to localStorage. Total enrollments:', enrollments.length);
        } catch (error) {
            console.error('❌ Error saving to localStorage:', error);
        }
    }
});
