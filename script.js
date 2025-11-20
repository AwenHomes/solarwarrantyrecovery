// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            state: document.getElementById('state').value,
            installer: document.getElementById('installer').value,
            issue: document.getElementById('issue').value,
            timestamp: new Date().toISOString()
        };

        // Basic validation
        if (!formData.name || !formData.email) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        try {
            // Store lead locally (for testing)
            saveLeadLocally(formData);

            // You can replace this with actual backend submission
            // Example: await submitToBackend(formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            showMessage('Thank you for joining our waitlist! We\'ll contact you when we launch and keep you updated on our progress.', 'success');
            form.reset();

            // Optional: Track conversion with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXXX/XXXXXX'});
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('There was an error submitting your information. Please try again or call us directly.', 'error');
        }
    });

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function saveLeadLocally(data) {
        // Save to localStorage for testing/demo purposes
        let leads = JSON.parse(localStorage.getItem('solarLeads') || '[]');
        leads.push(data);
        localStorage.setItem('solarLeads', JSON.stringify(leads));

        console.log('Lead saved:', data);
        console.log('Total leads:', leads.length);
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
});

// Function to export leads (for admin/testing use)
function exportLeads() {
    const leads = JSON.parse(localStorage.getItem('solarLeads') || '[]');

    if (leads.length === 0) {
        console.log('No leads to export');
        return;
    }

    // Convert to CSV
    const headers = ['Name', 'Email', 'Phone', 'State', 'Installer', 'Issue', 'Timestamp'];
    const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
            lead.name,
            lead.email,
            lead.phone || '',
            lead.state || '',
            lead.installer || '',
            `"${(lead.issue || '').replace(/"/g, '""')}"`,
            lead.timestamp
        ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log(`Exported ${leads.length} leads`);
}

// Optional: Add to window for console access
window.exportLeads = exportLeads;

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
