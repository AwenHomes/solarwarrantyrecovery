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

            showMessage('Thank you! We\'ll contact you within 24 hours to discuss your solar warranty recovery options.', 'success');
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

    // Handle Intake Assessment Form
    const intakeForm = document.getElementById('intakeForm');
    const intakeFormMessage = document.getElementById('intakeFormMessage');

    intakeForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Collect all form data
        const formData = {
            // Basic Information
            name: document.getElementById('intake-name').value,
            email: document.getElementById('intake-email').value,
            phone: document.getElementById('intake-phone').value,
            bestTime: document.getElementById('intake-best-time').value,
            location: document.getElementById('intake-location').value,

            // Solar System Information
            installer: document.getElementById('intake-installer').value,
            outOfBusiness: document.getElementById('intake-out-of-business').value,
            installationYear: document.getElementById('intake-installation-year').value,
            systemIssue: document.getElementById('intake-issue').value,

            // Equipment (checkboxes)
            equipment: Array.from(document.querySelectorAll('input[name="equipment"]:checked'))
                .map(checkbox => checkbox.value),
            otherEquipment: document.getElementById('intake-other-equipment-text').value,

            // Documentation
            documentation: document.querySelector('input[name="documentation"]:checked')?.value || '',

            // Previous Efforts
            previousEfforts: document.getElementById('intake-previous-efforts').value,

            // Warranty Status
            warrantyStatus: document.querySelector('input[name="warrantyStatus"]:checked')?.value || '',

            // Source
            source: document.querySelector('input[name="source"]:checked')?.value || '',
            sourceOther: document.getElementById('intake-source-other-text').value,

            // Additional Info
            additionalInfo: document.getElementById('intake-additional').value,

            // Metadata
            timestamp: new Date().toISOString(),
            formType: 'intake-assessment'
        };

        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.location ||
            !formData.installer || !formData.installationYear || !formData.systemIssue) {
            showIntakeMessage('Please fill in all required fields (marked with *).', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showIntakeMessage('Please enter a valid email address.', 'error');
            return;
        }

        try {
            // Save intake submission locally
            saveIntakeLocally(formData);

            // You can replace this with actual backend submission
            // Example: await submitToBackend(formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            showIntakeMessage('Thank you! I\'ll review your information and contact you within 24 hours to schedule a free 30-minute assessment call. During that call, I\'ll honestly tell you whether I think your case is viable.', 'success');
            intakeForm.reset();

            // Optional: Track conversion with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXXX/XXXXXX'});
            }

        } catch (error) {
            console.error('Error submitting intake form:', error);
            showIntakeMessage('There was an error submitting your information. Please try again or call us directly.', 'error');
        }
    });

    function showIntakeMessage(message, type) {
        intakeFormMessage.textContent = message;
        intakeFormMessage.className = `form-message ${type}`;

        // Scroll to message
        intakeFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function saveIntakeLocally(data) {
        // Save to localStorage for testing/demo purposes
        let intakeSubmissions = JSON.parse(localStorage.getItem('solarIntakeAssessments') || '[]');
        intakeSubmissions.push(data);
        localStorage.setItem('solarIntakeAssessments', JSON.stringify(intakeSubmissions));

        console.log('Intake assessment saved:', data);
        console.log('Total intake assessments:', intakeSubmissions.length);
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

// Function to export intake assessments (for admin/testing use)
function exportIntakeAssessments() {
    const assessments = JSON.parse(localStorage.getItem('solarIntakeAssessments') || '[]');

    if (assessments.length === 0) {
        console.log('No intake assessments to export');
        return;
    }

    // Convert to CSV with proper handling of arrays and special characters
    const headers = ['Name', 'Email', 'Phone', 'Best Time', 'Location', 'Installer', 'Out of Business', 'Installation Year', 'System Issue', 'Equipment', 'Other Equipment', 'Documentation', 'Previous Efforts', 'Warranty Status', 'Source', 'Source Other', 'Additional Info', 'Timestamp'];
    const csvContent = [
        headers.join(','),
        ...assessments.map(assessment => [
            assessment.name,
            assessment.email,
            assessment.phone || '',
            assessment.bestTime || '',
            assessment.location || '',
            assessment.installer || '',
            assessment.outOfBusiness || '',
            assessment.installationYear || '',
            `"${(assessment.systemIssue || '').replace(/"/g, '""')}"`,
            assessment.equipment ? assessment.equipment.join('; ') : '',
            assessment.otherEquipment || '',
            assessment.documentation || '',
            `"${(assessment.previousEfforts || '').replace(/"/g, '""')}"`,
            assessment.warrantyStatus || '',
            assessment.source || '',
            assessment.sourceOther || '',
            `"${(assessment.additionalInfo || '').replace(/"/g, '""')}"`,
            assessment.timestamp
        ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar-intake-assessments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log(`Exported ${assessments.length} intake assessments`);
}

// Optional: Add to window for console access
window.exportIntakeAssessments = exportIntakeAssessments;

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
