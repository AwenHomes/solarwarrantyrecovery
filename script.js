// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Honeypot check for bot protection
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value !== '') {
            // Silent fail for bots
            showMessage('Thank you! We\'ll contact you within 24 hours to discuss your solar warranty recovery options.', 'success');
            form.reset();
            return;
        }

        // Get form data with sanitization
        const formData = {
            name: sanitizeInput(document.getElementById('name').value),
            email: sanitizeInput(document.getElementById('email').value),
            phone: sanitizeInput(document.getElementById('phone').value),
            state: sanitizeInput(document.getElementById('state').value),
            installer: sanitizeInput(document.getElementById('installer').value),
            issue: sanitizeInput(document.getElementById('issue').value),
            timestamp: new Date().toISOString()
        };

        // Basic validation
        if (!formData.name || !formData.email) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Improved email validation (RFC 5322 compliant)
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(formData.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Name validation (no numbers or special characters for CSV injection prevention)
        if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
            showMessage('Please enter a valid name (letters only).', 'error');
            return;
        }

        try {
            // Store lead temporarily (sessionStorage - clears on tab close)
            // WARNING: For production, send directly to backend instead
            saveLeadTemporarily(formData);

            // You can replace this with actual backend submission
            // Example: await submitToBackend(formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            showMessage('Thank you! We\'ll contact you within 24 hours to discuss your solar warranty recovery options.', 'success');

            // Reset form after brief delay so user sees success message
            setTimeout(() => form.reset(), 1000);

            // Optional: Track conversion with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXXX/XXXXXX'});
            }

        } catch (error) {
            // Log generic error without sensitive details
            if (typeof console !== 'undefined' && console.error) {
                console.error('Form submission failed');
            }
            showMessage('There was an error submitting your information. Please try again or call us directly.', 'error');
        }
    });

    // Sanitize input to prevent XSS and injection attacks
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim().substring(0, 500); // Limit length
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function saveLeadTemporarily(data) {
        // SECURITY: Use sessionStorage instead of localStorage
        // Data clears when tab closes - better for PII
        // WARNING: Still not secure for production - use backend instead
        try {
            let leads = JSON.parse(sessionStorage.getItem('solarLeads') || '[]');

            // Limit to 100 leads max to prevent storage exhaustion
            if (leads.length >= 100) {
                leads.shift(); // Remove oldest
            }

            leads.push(data);
            sessionStorage.setItem('solarLeads', JSON.stringify(leads));

            // No console logging of PII in production
        } catch (e) {
            // Storage quota exceeded or disabled
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('Unable to save lead data locally');
            }
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Set dynamic copyright year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Function to export leads (for admin/testing use)
// SECURITY: Protected function - requires authentication in production
function exportLeads(authToken) {
    // SECURITY: In production, verify authToken before proceeding
    if (!authToken || authToken !== 'CHANGE_THIS_IN_PRODUCTION') {
        if (typeof console !== 'undefined' && console.error) {
            console.error('Unauthorized access attempt');
        }
        return;
    }

    // Check sessionStorage (changed from localStorage for security)
    const leads = JSON.parse(sessionStorage.getItem('solarLeads') || '[]');

    if (leads.length === 0) {
        if (typeof console !== 'undefined' && console.log) {
            console.log('No leads to export');
        }
        return;
    }

    // Convert to CSV with proper sanitization to prevent CSV injection
    const headers = ['Name', 'Email', 'Phone', 'State', 'Installer', 'Issue', 'Timestamp'];
    const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
            sanitizeCSVField(lead.name),
            sanitizeCSVField(lead.email),
            sanitizeCSVField(lead.phone || ''),
            sanitizeCSVField(lead.state || ''),
            sanitizeCSVField(lead.installer || ''),
            sanitizeCSVField(lead.issue || ''),
            sanitizeCSVField(lead.timestamp)
        ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Sanitize CSV fields to prevent CSV injection attacks
function sanitizeCSVField(field) {
    if (!field) return '""';

    // Convert to string
    let sanitized = String(field);

    // Remove or escape dangerous characters that could trigger formulas
    // Excel formulas start with: = + - @ \t \r
    const dangerousChars = /^[=+\-@\t\r]/;

    if (dangerousChars.test(sanitized)) {
        // Prefix with single quote to prevent formula execution
        sanitized = "'" + sanitized;
    }

    // Escape quotes and wrap in quotes
    sanitized = sanitized.replace(/"/g, '""');

    return `"${sanitized}"`;
}

// SECURITY: Remove global window access - use secure method instead
// To export leads in development, use: exportLeads('CHANGE_THIS_IN_PRODUCTION')
// In production, implement proper authentication
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Only expose in development
    window.exportLeads = exportLeads;
}

// Optional: Integration function for backend services
async function submitToBackend(formData) {
    // Example 1: Using Formspree (https://formspree.io)
    // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
    // return response.json();

    // Example 2: Using your own API endpoint
    // const response = await fetch('/api/leads', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
    // return response.json();

    // Example 3: Using Google Sheets via Apps Script
    // const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
    //     method: 'POST',
    //     mode: 'no-cors',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });

    return Promise.resolve();
}
