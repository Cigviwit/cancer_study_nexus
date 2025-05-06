// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const viewDropdown = document.getElementById('view-dropdown');
    const viewDropdownMenu = document.getElementById('view-dropdown-menu');
    const viewDropdownItems = viewDropdownMenu.querySelectorAll('a');
    const viewText = document.getElementById('view-text');
    const adminDashboard = document.getElementById('admin-dashboard');
    const coordinatorDashboard = document.getElementById('coordinator-dashboard');
    const patientDashboard = document.getElementById('patient-dashboard');
    const patientDirectory = document.getElementById('patient-directory');
    
    // Add overlay for mobile
    const createOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'mobile-overlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-30 hidden md:hidden';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            sidebar.setAttribute('data-drawer', 'closed');
            overlay.classList.add('hidden');
        });
        
        return overlay;
    };
    
    const overlay = createOverlay();

    // Toggle sidebar on mobile
    sidebarToggle.addEventListener('click', function() {
        const isOpen = sidebar.getAttribute('data-drawer') === 'open';
        sidebar.setAttribute('data-drawer', isOpen ? 'closed' : 'open');
        
        // Toggle overlay
        if (sidebar.getAttribute('data-drawer') === 'open') {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.setAttribute('data-drawer', 'closed');
            overlay.classList.add('hidden');
        }
    });

    // Initialize dropdown menu
    viewDropdownMenu.classList.add('hidden');

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!viewDropdown.contains(e.target) && !viewDropdownMenu.contains(e.target)) {
            viewDropdownMenu.classList.add('hidden');
        }
    });

    // Toggle dropdown menu
    viewDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        viewDropdownMenu.classList.toggle('hidden');
    });

    let currentView = 'admin'; // Add shared variable for current view

    function showDashboard() {
        adminDashboard.classList.add('hidden');
        coordinatorDashboard.classList.add('hidden');
        patientDashboard.classList.add('hidden');
        switch(currentView) {
            case 'admin':
                adminDashboard.classList.remove('hidden');
                break;
            case 'coordinator':
                coordinatorDashboard.classList.remove('hidden');
                break;
            case 'patient':
                patientDashboard.classList.remove('hidden');
                break;
        }
    }

    // Handle view selection
    viewDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            
            // Update button text
            viewText.textContent = `${view.charAt(0).toUpperCase() + view.slice(1)} View`;
            
            // Close dropdown
            viewDropdownMenu.classList.add('hidden');
            
            // Set current view and show dashboard
            currentView = view;
            showDashboard();
            
            // Update navigation visibility
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                switch (view) {
                    case 'admin':
                        link.style.display = 'flex'; // Show all links for admin
                        break;
                    case 'coordinator':
                        link.style.display = (link.id === 'dashboard-link' || link.id === 'patients-link') ? 'flex' : 'none';
                        break;
                    case 'patient':
                        link.style.display = link.id === 'dashboard-link' ? 'flex' : 'none';
                        break;
                }
            });
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.setAttribute('data-drawer', 'closed');
                overlay.classList.add('hidden');
            }
        });
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide all content and patient directory
            adminDashboard.classList.add('hidden');
            coordinatorDashboard.classList.add('hidden');
            patientDashboard.classList.add('hidden');
            patientDirectory.classList.add('hidden');

            // Show appropriate content based on link and current view
            switch (this.getAttribute('href')) {
                case '#dashboard':
                    showDashboard();
                    break;
                case '#patients':
                    if (currentView === 'admin' || currentView === 'coordinator') {
                        patientDirectory.classList.remove('hidden');
                    } else {
                        alert('You do not have permission to view this section.');
                    }
                    break;
                case '#alerts':
                    alert('Alerts page will be implemented in future stages');
                    break;
                case '#sites':
                    alert('Sites page will be implemented in future stages');
                    break;
            }

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.setAttribute('data-drawer', 'closed');
                overlay.classList.add('hidden');
            }
        });
    });

    // Initialize with dashboard view
    showDashboard();

    // Search functionality
    const searchInput = document.getElementById('patient-search');
    const statusFilter = document.getElementById('status-filter');
    const siteFilter = document.getElementById('site-filter');
    const patientTable = document.querySelector('table tbody');

    function filterPatients() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const site = siteFilter.value;
        
        const rows = patientTable.getElementsByTagName('tr');
        
        for (let row of rows) {
            const id = row.cells[0].textContent.toLowerCase();
            const name = row.cells[1].textContent.toLowerCase();
            const siteValue = row.cells[2].textContent.toLowerCase();
            const statusValue = row.cells[3].textContent.toLowerCase();
            
            const matchesSearch = id.includes(searchTerm) || name.includes(searchTerm);
            const matchesStatus = !status || statusValue.includes(status);
            const matchesSite = !site || siteValue.includes(site);
            
            if (matchesSearch && matchesStatus && matchesSite) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }

    searchInput.addEventListener('input', filterPatients);
    statusFilter.addEventListener('change', filterPatients);
    siteFilter.addEventListener('change', filterPatients);

    // Add patient button functionality
    const addPatientButton = document.getElementById('add-patient');
    
    addPatientButton.addEventListener('click', function() {
        // In future stages, this will open a modal or navigate to add patient form
        alert('Add patient functionality will be implemented in future stages');
    });

    // Initialize Flowbite components
    flowbite.init();

    // Add Supabase client configuration (ready for future integration)
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_KEY';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // Add any additional UI initialization code here
    // (Note: All actual functionality will be implemented in later stages)
});
