# Jerome Institute of Technology - Student Enrollment Website

A professional and responsive student enrollment system for Jerome Institute of Technology.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Comprehensive Enrollment Form**: Collects personal, contact, and academic information
- **Form Validation**: Client-side validation for data integrity
- **Modern UI**: Beautiful gradient design with smooth animations
- **Local Storage**: Automatically saves enrollment data
- **Multiple Programs**: Computer Science, Engineering, Business Administration, and Data Science

## Project Structure

```
jerome-institute-enrollment/
├── index.html           # Main HTML file
├── css/
│   └── styles.css       # Styling and responsive layout
├── js/
│   └── form-handler.js  # Form logic and validation
├── README.md            # This file
└── .gitignore          # Git ignore file
```

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Fill out the enrollment form and submit

## Form Fields

### Personal Information
- First Name
- Last Name
- Email Address
- Phone Number
- Date of Birth

### Contact Information
- Street Address
- City
- State
- ZIP Code

### Academic Information
- Program of Interest
- Degree Level
- GPA (optional)
- Enrollment Term

### Additional Information
- International Student (checkbox)
- Essay/Motivation Letter
- Terms and Conditions (checkbox)

## Backend Integration

To connect this form to a backend API:

1. Uncomment the `sendToBackend()` function in `js/form-handler.js`
2. Update the API endpoint (`/api/enroll`) to your backend URL
3. Ensure your backend accepts POST requests with JSON data

## Customization

- **Colors**: Modify the gradient colors in `css/styles.css`
- **Programs**: Add/remove programs in the `<select>` dropdown
- **Contact Info**: Update email, phone, and address in the Contact section
- **Terms**: Customize the terms and conditions as needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 Jerome Institute of Technology. All rights reserved.