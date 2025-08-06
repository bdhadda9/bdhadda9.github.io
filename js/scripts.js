document.addEventListener('DOMContentLoaded', function() {

    // Dynamic Header and Footer
    // I'm using the Fetch API to load the header and footer, to avoid repeating code on every page.
    function loadComponent(url, placeholderId) {
        fetch(url)
            .then(response => response.text()) 
            .then(data => {
                // Using DOM Manipulation, finding the placeholder div and setting its content.
                document.getElementById(placeholderId).innerHTML = data;
                // Set up the theme switcher after the header is loaded.
                if (placeholderId === 'header-placeholder') {
                    setupThemeSwitcher();
                }
            })
            .catch(error => {
                // Error logging in case
                console.error('Error loading component:', error);
            });
    }

    // Load the two components for Headers/Footers.
    loadComponent('header.html', 'header-placeholder');
    loadComponent('footer.html', 'footer-placeholder');

    // Part 1: Implementing a Light/Dark Mode using Cookies.
    // A function to create a new cookie.
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // A function to get the value of a cookie.
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // This function sets up the button for switching themes.
    function setupThemeSwitcher() {
        // Using getElementById to reference a specific element.
        const themeToggleButton = document.getElementById('theme-toggle');
        
        if (!themeToggleButton) {
            return; // Stop if the button isn't on the page.
        }

        // Check for the theme cookie when the page loads.
        let theme = getCookie("theme");
        if (theme === "dark") {
            // Using classList to change CSS
            document.body.classList.add("dark-mode");
            themeToggleButton.textContent = 'Light Mode';
        } else {
            themeToggleButton.textContent = 'Dark Mode';
        }

        // Using addEventListener to handle a 'click' event.
        themeToggleButton.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');

            // Checking which theme is active and saving it in a cookie for 1 year.
            if (document.body.classList.contains('dark-mode')) {
                themeToggleButton.textContent = 'Light Mode';
                setCookie('theme', 'dark', 365);
            } else {
                themeToggleButton.textContent = 'Dark Mode';
                setCookie('theme', 'light', 365);
            }
        });
    }


// Part 2: Dynamic Blog Posts
    const blogListContainer = document.getElementById('blog-list');
    if (blogListContainer) {
        // Using the Fetch API again to get my posts.json file.
        fetch('posts.json')
            .then(response => response.json()) 
            .then(posts => {
                blogListContainer.innerHTML = ''; // Clear any placeholder content.

                // Using the forEach method to loop over the array of posts.
                posts.forEach(post => {
                    // Using DOM manipulation techniques.
                    const postElement = document.createElement('div');

                    postElement.classList.add('card'); // Border

                    const title = document.createElement('h3');
                    title.textContent = post.title;

                    const meta = document.createElement('p');
                    meta.innerHTML = `<em>Date: ${post.date}</em>`; // Italicss 

                    const content = document.createElement('div');
                    content.innerHTML = post.content; // Using innerHTML to render tags from JSON
                    
                    // Appending the created elements to build the post structure.
                    postElement.appendChild(title);
                    postElement.appendChild(meta);
                    postElement.appendChild(content);

                    // Adding the finished post to the page.
                    blogListContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                blogListContainer.innerHTML = '<p>Sorry, error loading blog posts.</p>';
            });
    }

});