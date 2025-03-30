// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  // Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector('form[role="search"]');
  const searchInput = document.getElementById('searchInput');
  
  // Handle form submission
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      // Only proceed if search input has value
      if (!searchInput.value.trim()) {
        e.preventDefault();
        return false;
      }
    });
  }
  
  // Pre-fill search box with query if present
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q');
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
  }
});