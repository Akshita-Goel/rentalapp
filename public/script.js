// DOM elements
const rentalForm = document.getElementById('rental-preferences');
const propertiesList = document.getElementById('properties-list');
const loadingIndicator = document.getElementById('loading');
const noResultsMessage = document.getElementById('no-results');
const resultsSection = document.getElementById('results-section');
const sortBySelect = document.getElementById('sort-by');
const gridViewButton = document.getElementById('grid-view');
const listViewButton = document.getElementById('list-view');

// Hide results section initially
resultsSection.style.display = 'none';

// API configuration
const API_BASE_URL = '/api';  // We'll replace this with actual API endpoint

// Form submission
rentalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show results section and loading state
    resultsSection.style.display = 'block';
    loadingIndicator.style.display = 'block';
    noResultsMessage.style.display = 'none';
    propertiesList.innerHTML = '';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Get form data
    const formData = new FormData(rentalForm);
    const preferences = {
        user: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            moveInDate: formData.get('movein-date')
        },
        location: {
            city: formData.get('city'),
            // neighborhood: formData.get('neighborhood'),
            maxCommuteTime: formData.get('commute'),
            commuteLocation: formData.get('commute-location')
        },
        property: {
            type: formData.get('property-type'),
            bedrooms: formData.get('bedrooms'),
            bathrooms: formData.get('bathrooms'),
            priceRange: {
                min: formData.get('min-price') ? parseInt(formData.get('min-price')) : null,
                max: formData.get('max-price') ? parseInt(formData.get('max-price')) : null
            }
        },
        amenities: Array.from(formData.getAll('amenities'))
    };
    
    // Fetch matching properties
    fetchProperties(preferences);
});

// Fetch properties from API
async function fetchProperties(preferences) {
    try {
        setTimeout(() => {
            // Sample data - in a real app, this would come from the API
            const properties = [
                {
                    id: 1,
                    title: "Modern Downtown Apartment",
                    address: "Balkum, Thane",
                    city: "Mumbai",
                    price: 1800,
                    bedrooms: 2,
                    bathrooms: 1,
                    propertyType: "apartment",
                    sqft: 950,
                    imageUrl: "https://re-nj.com/wp-content/uploads/2024/07/FIAT-House-Sala-Social-Lounge-770x565.jpeg", // Placeholder image
                    amenities: ["parking", "ac", "dishwasher"],
                    description: "Beautiful modern apartment in the heart of downtown.",
                    dateAvailable: "2025-05-01",
                    dateAdded: "2025-03-15"
                },
                {
                    "id": 2,
                    "title": "Sunrise Girls PG",
                    "address": "Koramangala, Bangalore",
                    "city": "Bangalore",
                    "price": 9000,
                    "bedrooms": 1,
                    "bathrooms": 1,
                    "propertyType": "Girls PG",
                    "sqft": 600,
                    "imageUrl": "https://imgs.search.brave.com/C6K8ScG2hMWWzIM9eZNVtj5jA4YHgBc6gL-KYiM2jiE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9rcmlw/YWxob21lcy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjMv/MDIvNDZmZDZmYjkt/YWI1My00OWQ1LTg5/ZWQtNjQ4NzAzNGE2/MzRjLWUxNjI1MDQx/NzQzNTQ3LmpwZw",
                    "amenities": ["wifi", "cctv", "laundry", "mess"],
                    "description": "Comfortable PG for girls with security and home-like meals.",
                    "dateAvailable": "2025-04-05",
                    "dateAdded": "2025-03-18"
                  },
                  {
                    "id": 3,
                    "title": "Elite Boys Hostel",
                    "address": "Connaught Place, Delhi",
                    "city": "Delhi",
                    "price": 8500,
                    "bedrooms": 1,
                    "bathrooms": 1,
                    "propertyType": "Boys Hostel",
                    "sqft": 650,
                    "imageUrl": "https://imgs.search.brave.com/o1s0-8vHT7aouOnBm1TA0IFS9nbfITvp2FKxa6M1v7U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzczLzI4Lzgy/LzM2MF9GXzc3MzI4/ODIyOF9BeXRlRlli/THd4akxUNXQ4UThK/VlNvM1Z2dmQ2VVRh/RS5qcGc",
                    "amenities": ["gym", "power backup", "wifi", "meals"],
                    "description": "Spacious hostel for boys with gym and meal facilities.",
                    "dateAvailable": "2025-04-15",
                    "dateAdded": "2025-03-20"
                  },
                  {
                    "id": 4,
                    "title": "Cozy Co-Living Space",
                    "address": "Powai, Mumbai",
                    "city": "Mumbai",
                    "price": 11000,
                    "bedrooms": 2,
                    "bathrooms": 2,
                    "propertyType": "Co-Living Space",
                    "sqft": 720,
                    "imageUrl": "https://imgs.search.brave.com/69Fl-ZvJIzS71j23Xr4Pleq0c0Ajt-P-Z6Qy6GQHIJQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5obW8tYXJjaGl0/ZWN0cy5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjIvMDQv/MzAxMDQ3MzEvY29s/aXZpbmcuanBn",
                    "amenities": ["community events", "workspace", "laundry", "ac"],
                    "description": "Vibrant co-living space with shared workspace and community events.",
                    "dateAvailable": "2025-04-07",
                    "dateAdded": "2025-03-22"
                  },
                  {
                    "id": 5,
                    "title": "Budget-Friendly PG",
                    "address": "Gachibowli, Hyderabad",
                    "city": "Hyderabad",
                    "price": 7500,
                    "bedrooms": 2,
                    "bathrooms": 1,
                    "propertyType": "Paying Guest",
                    "sqft": 500,
                    "imageUrl": "https://imgs.search.brave.com/piF5UCfDtXtmsIADFc-GH7GdtaE9FP7gBmxz8DeaG4M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcG9s/bG8ub2x4LmluL3Yx/L2ZpbGVzL292dW40/cG0yeWhoOTEtQURW/SU4vaW1hZ2U7cz0y/NzJ4MA",
                    "amenities": ["wifi", "meals", "parking", "security"],
                    "description": "Affordable PG with home-cooked meals and high-speed internet.",
                    "dateAvailable": "2025-04-12",
                    "dateAdded": "2025-03-25"
                  },
                  {
                    "id": 6,
                    "title": "Luxury Boys PG",
                    "address": "Hinjewadi, Pune",
                    "city": "Pune",
                    "price": 9500,
                    "bedrooms": 3,
                    "bathrooms": 1,
                    "propertyType": "Boys PG",
                    "sqft": 680,
                    "imageUrl": "https://imgs.search.brave.com/GOT7fPdmGt3PtGVi3VkGrGsZUPf2BXCulLO2OA9i09U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/c3RhdGljbWIuY29t/L21icGhvdG8vcGcv/Z3JkMi9jcm9wcGVk/X2ltYWdlcy8yMDI0/L0p1bi8yNS9QaG90/b19oNDAwX3c1NDAv/R1IyLTI3MDIyMS0y/MTcxOTQ3XzQwMF81/NDAuanBlZw",
                    "amenities": ["ac", "wifi", "tv", "laundry"],
                    "description": "Spacious and luxurious PG for boys with modern amenities.",
                    "dateAvailable": "2025-04-08",
                    "dateAdded": "2025-03-27"
                  },
                  {
                    "id": 7,
                    "title": "Studio Apartment",
                    "address": "Salt Lake City, Kolkata",
                    "city": "Kolkata",
                    "price": 14000,
                    "bedrooms": 3,
                    "bathrooms": 2,
                    "propertyType": "Studio Apartment",
                    "sqft": 800,
                    "imageUrl": "https://imgs.search.brave.com/IGKjPID42daWapsQR0L4SCELLv3q3r8sckDu9bcjZUs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI4/MjI3NjUyMi9waG90/by9ob2xpZGF5LXN0/dWRpby1hcGFydG1l/bnQuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPVZqZzhRNXdE/UDlJbU81bHRtc1Ns/bFZvcXdBUTV2UXNp/NzJxVlRRbGxNSGs9",
                    "amenities": ["furnished", "wifi", "kitchen", "ac"],
                    "description": "Modern studio apartment ideal for working professionals.",
                    "dateAvailable": "2025-04-20",
                    "dateAdded": "2025-03-30"
                  },
                  {
                    "id": 8,
                    "title": "Affordable Women's PG",
                    "address": "Sector 62, Noida",
                    "city": "Noida",
                    "price": 8500,
                    "bedrooms": 3,
                    "bathrooms": 3,
                    "propertyType": "Girls PG",
                    "sqft": 620,
                    "imageUrl": "https://imgs.search.brave.com/RriDODh1jh31j9bApW3t0RqG7134Cs8taxW1MXDPThc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/c3RhdGljbWIuY29t/L21icGhvdG8vcGcv/Z3JkMi9jcm9wcGVk/X2ltYWdlcy8yMDI0/L01hci8xNC9QaG90/b19oNDAwX3c1NDAv/R1IyLTQyNTM1My0y/MDcxODA3XzQwMF81/NDAuanBlZw",
                    "amenities": ["cctv", "wifi", "housekeeping", "mess"],
                    "description": "Safe and secure PG for women with essential facilities.",
                    "dateAvailable": "2025-04-14",
                    "dateAdded": "2025-03-29"
                  },
                  {
                    "id": 9,
                    "title": "Minimalist Co-Living Space",
                    "address": "Anna Nagar, Chennai",
                    "city": "Chennai",
                    "price": 11500,
                    "bedrooms": 1,
                    "bathrooms": 1,
                    "propertyType": "Co-Living Space",
                    "sqft": 700,
                    "imageUrl": "https://imgs.search.brave.com/PcSTrxaV7faH-f660Ve1TFcHv_r68GEGnOFhf3i-jHg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzU3/YzgzMmIzMjk5NGNh/Y2UxOGU1NjU3Ny8x/NTY1NzY4ODc0NjUx/LUlTMVJFVEw2R0VX/VDJJUlpZOUg2LzEy/MGNvbGl2aW5nLTEu/anBn",
                    "amenities": ["common kitchen", "wifi", "workspace", "community events"],
                    "description": "Peaceful co-living space with a minimalist design and common workspace.",
                    "dateAvailable": "2025-04-18",
                    "dateAdded": "2025-03-31"
                  },
                  {
                    "id": 10,
                    "title": "Spacious Single Room PG",
                    "address": "Baner, Pune",
                    "city": "Pune",
                    "price": 8700,
                    "bedrooms": 2,
                    "bathrooms": 1,
                    "propertyType": "Paying Guest",
                    "sqft": 640,
                    "imageUrl": "https://imgs.search.brave.com/c33hf7SouN6SFitX0tVjYGl_wbOpRROxALBF2-VXCqA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/c3RhdGljbWIuY29t/L21icGhvdG8vcGcv/Z3JkMi9jcm9wcGVk/X2ltYWdlcy8yMDI1/L0phbi8xMy9QaG90/b19oNDAwX3c1NDAv/R1IyLTQ3ODgwMS0y/MzY1MTQ1XzQwMF81/NDAuanBlZw",
                    "amenities": ["tv", "wifi", "laundry", "parking"],
                    "description": "Fully furnished single-room PG with a homely atmosphere.",
                    "dateAvailable": "2025-04-22",
                    "dateAdded": "2025-04-02"
                  },
                  {
                    "id": 11,
                    "title": "Premium Co-Living Space",
                    "address": "MG Road, Gurgaon",
                    "city": "Gurgaon",
                    "price": 13000,
                    "bedrooms": 2,
                    "bathrooms": 1,
                    "propertyType": "Co-Living Space",
                    "sqft": 720,
                    "imageUrl": "https://imgs.search.brave.com/isKuJ3gzi8hKxkQBcIBcsXItaJU6BKQnZJBYEeGF4Cg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5hcmNoaXRlY3R1/cmFsZGlnZXN0LmNv/bS9waG90b3MvNWE5/NTg0MTE0NjkyMTI2/ZTA2ZjM0ZjkxL21h/c3Rlci93XzE2MDAs/Y19saW1pdC9jb21t/b24tYnJpYXItaG91/c2UtMDMuanBn",
                    "amenities": ["wifi", "gym", "laundry", "ac"],
                    "description": "Luxury co-living with all-inclusive facilities for professionals.",
                    "dateAvailable": "2025-04-15",
                    "dateAdded": "2025-03-27",
                    hasVirtualTour: true
                  },
                  {
                    "id": 12,
                    "title": "Budget Boys PG",
                    "address": "Sector 14, Gurgaon",
                    "city": "Gurgaon",
                    "price": 9000,
                    "bedrooms": 4,
                    "bathrooms": 2,
                    "propertyType": "Boys PG",
                    "sqft": 650,
                    "imageUrl": "https://imgs.search.brave.com/n0wmcD0_e2TCBLEssKFWl63ixprIQ4edAMqWGGRdRNg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/c3RhdGljbWIuY29t/L21icGhvdG8vcGcv/Z3JkMi9jcm9wcGVk/X2ltYWdlcy8yMDI1/L0ZlYi8xMy9QaG90/b19oNDAwX3c1NDAv/R1IyLTQ4MjQ4Ny0y/MzkzNzY3XzQwMF81/NDAuanBlZw",
                    "amenities": ["wifi", "laundry", "mess", "cctv"],
                    "description": "Affordable PG for boys with good security and homely meals.",
                    "dateAvailable": "2025-04-10",
                    "dateAdded": "2025-03-20"
                  },
                  {
                    "id": 13,
                    "title": "Women’s Safe PG",
                    "address": "Sector 56, Gurgaon",
                    "city": "Gurgaon",
                    "price": 9800,
                    "bedrooms": 4,
                    "bathrooms": 4,
                    "propertyType": "Girls PG",
                    "sqft": 600,
                    "imageUrl": "https://imgs.search.brave.com/E0godmkAZRG47H7dV3BSJC8_el9AojISGd6zrp1caN8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9rcmlw/YWxob21lcy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjQv/MDUvRFNDMDk2NDRf/NV82X0JhbGFuY2Vy/LXNjYWxlZC5qcGc",
                    "amenities": ["security", "laundry", "wifi", "mess"],
                    "description": "Secure and well-maintained PG for female residents.",
                    "dateAvailable": "2025-04-05",
                    "dateAdded": "2025-03-18"
                  },
                  {
                    "id": 14,
                    "title": "Single Room PG",
                    "address": "HSR Layout, Bangalore",
                    "city": "Bangalore",
                    "price": 10500,
                    "bedrooms": 3,
                    "bathrooms": 2,
                    "propertyType": "Paying Guest",
                    "sqft": 620,
                    "imageUrl": "https://imgs.search.brave.com/W0X07aybSuUSavSxDt4jwfsb74MWx85g-ZxJll0UREg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTU3/Njc3NjE0L3Bob3Rv/L2hpc3RvcmljLWlu/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9ZktzaGJtblVP/R2E3UW9oeTIwdWVj/c3ZUVnhWUnZtb2Jp/Qmw1c1ZQRFA3Yz0",
                    "amenities": ["wifi", "ac", "laundry", "tv"],
                    "description": "Well-furnished PG with independent single rooms for privacy.",
                    "dateAvailable": "2025-04-12",
                    "dateAdded": "2025-03-22"
                  },
                  {
                    "id": 15,
                    "title": "Premium Boys Hostel",
                    "address": "Andheri West, Mumbai",
                    "city": "Mumbai",
                    "price": 11500,
                    "bedrooms": 4,
                    "bathrooms": 1,
                    "propertyType": "Boys Hostel",
                    "sqft": 670,
                    "imageUrl": "https://imgs.search.brave.com/hdMfYL4BPDcI7ua9kbUGtKk_7vs2-mEjdXk4RbbLYI4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by92aW50YWdlLWV1/cm9wZWFuLWNpdHkt/aG9zdGVsXzYzNjUz/Ny0zMzcxOTIuanBn/P3NlbXQ9YWlzX2h5/YnJpZA",
                    "amenities": ["wifi", "parking", "laundry", "mess"],
                    "description": "Spacious and well-managed hostel for boys near work hubs.",
                    "dateAvailable": "2025-04-07",
                    "dateAdded": "2025-03-24"
                  },
                  {
                    "id": 16,
                    "title": "Shared Studio Apartment",
                    "address": "Whitefield, Bangalore",
                    "city": "Bangalore",
                    "price": 14000,
                    "bedrooms": 1,
                    "bathrooms": 1,
                    "propertyType": "Studio Apartment",
                    "sqft": 800,
                    "imageUrl": "https://imgs.search.brave.com/JcXeGqxzVqiDKrHR1hLrC9ZG0pZFV3HOdDglBSo3Cbk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YXBhcnRtZW50dGhl/cmFweS5pbmZvL2lt/YWdlL3VwbG9hZC9m/X2F1dG8scV9hdXRv/OmVjbyx3XzczMC9h/dC9ob3VzZSUyMHRv/dXJzLzIwMjMtSG91/c2UtVG91cnMvMjAy/My1KYW51YXJ5L0x1/LUNoYW4vaG91c2Ut/dG91cnMtbHUtY2hh/bi1uZXcteW9yay0w/Mzc3MzM",
                    "amenities": ["kitchen", "ac", "wifi", "workspace"],
                    "description": "Modern studio apartment suitable for working professionals.",
                    "dateAvailable": "2025-04-18",
                    "dateAdded": "2025-03-30"
                  },
                  {
                    "id": 17,
                    "title": "Affordable Co-Living",
                    "address": "Viman Nagar, Pune",
                    "city": "Pune",
                    "price": 12000,
                    "bedrooms": 1,
                    "bathrooms": 1,
                    "propertyType": "Co-Living Space",
                    "sqft": 750,
                    "imageUrl": "https://imgs.search.brave.com/pMHs0zmXYvkRAK6M8ZtmSm5UlLetq9Jnnf8o_ZF2uuM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YnJpY2t1bmRlcmdy/b3VuZC5jb20vc2l0/ZXMvZGVmYXVsdC9m/aWxlcy9heWElMjBr/aXRjaGVuLmpwZWc",
                    "amenities": ["wifi", "laundry", "parking", "community events"],
                    "description": "Vibrant co-living with social spaces and shared amenities.",
                    "dateAvailable": "2025-04-20",
                    "dateAdded": "2025-04-02"
                  },
                  {
                    "id": 18,
                    "title": "Fully Furnished PG",
                    "address": "Sector 18, Noida",
                    "city": "Noida",
                    "price": 9500,
                    "bedrooms": 2,
                    "bathrooms": 2,
                    "propertyType": "Paying Guest",
                    "sqft": 620,
                    "imageUrl": "https://imgs.search.brave.com/4xWHGs29l3blXrfCOj8fkL-Czi8E7O-Gb5vL46DCqaU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcG9s/bG8ub2x4LmluL3Yx/L2ZpbGVzL2dpbHc4/MTBmN3RwNS1BRFZJ/Ti9pbWFnZTtzPTI3/Mngw",
                    "amenities": ["wifi", "security", "laundry", "mess"],
                    "description": "PG with furnished rooms and home-style food options.",
                    "dateAvailable": "2025-04-14",
                    "dateAdded": "2025-03-28"
                  },
                  {
                    "id": 19,
                    "title": "Modern Girls Hostel",
                    "address": "Sector 43, Gurgaon",
                    "city": "Gurgaon",
                    "price": 8800,
                    "bedrooms": 1,
                    "bathrooms": 1,
                    "propertyType": "Girls Hostel",
                    "sqft": 600,
                    "imageUrl": "https://imgs.search.brave.com/4Ex05yMTjlj7NKKySlNLcymhY7HSXYAi2KPX1EYASlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEwLzE3LzExLzI2/LzM2MF9GXzEwMTcx/MTI2MjRfUnFSRGpk/akNhOWVTTlJoZGlE/ODhFT085YWhrRHhQ/bGcuanBn",
                    "amenities": ["wifi", "security", "laundry", "common room"],
                    "description": "Modern hostel with shared amenities for girls.",
                    "dateAvailable": "2025-04-09",
                    "dateAdded": "2025-03-26",
                    hasVirtualTour: true
                  },
                  {
                    "id": 20,
                    "title": "Luxury Co-Living Space",
                    "address": "Bandra, Mumbai",
                    "city": "Mumbai",
                    "price": 16000,
                    "bedrooms": 1,
                    "bathrooms": 1,
                    "propertyType": "Co-Living Space",
                    "sqft": 780,
                    "imageUrl": "https://imgs.search.brave.com/2veWt8wcrZUzBbjJcK-OtYR2anWWkPxEbHVf3P9wXzI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YW55cGxhY2UuY29t/L19uZXh0L2ltYWdl/P3VybD1odHRwczov/L2Nkbi5hbnlwbGFj/ZS5jb20vc3lzdGVt/L3VwbG9hZHMvaG90/ZWxzL3Jvb20vcGhv/dG9zLzEzMzI1LzA3/OTY0YTQwLWQ5MDQt/NGQ4ZS1hMTNjLTZi/ZWU3MjY4YmVlMy5q/cGVnJnc9MTI4MCZx/PTc1",
                    "amenities": ["wifi", "gym", "laundry", "rooftop"],
                    "description": "Premium co-living space with high-end facilities and networking events.",
                    "dateAvailable": "2025-04-25",
                    "dateAdded": "2025-04-01"
                  }
            ];
            
            // Display properties
            displayProperties(filterProperties(properties, preferences));
        }, 1500); // Simulate 1.5 second API delay
    } catch (error) {
        console.error("Error fetching properties:", error);
        displayError("There was an error fetching properties. Please try again later.");
    }
}

// Filter properties based on user preferences
function filterProperties(properties, preferences) {
    return properties.filter(property => {
        if (preferences.location.city && property.city !== preferences.location.city) {
            return false;
        }
        // Filter by property type
        if (preferences.property.type && property.propertyType !== preferences.property.type) {
            return false;
        }

        if (preferences.property.bedrooms) {
            if (preferences.property.bedrooms.includes("+")) {
                const minBedrooms = parseInt(preferences.property.bedrooms);
                if (parseInt(property.bedrooms) < minBedrooms) {
                    return false;
                }
            } else if (property.bedrooms !== preferences.property.bedrooms) {
                return false;
            }
        }

        // Filter by bathrooms (handling "3+" style values)
        if (preferences.property.bathrooms) {
            if (preferences.property.bathrooms.includes("+")) {
                const minBathrooms = parseFloat(preferences.property.bathrooms);
                if (parseFloat(property.bathrooms) < minBathrooms) {
                    return false;
                }
            } else if (parseFloat(property.bathrooms) !== parseFloat(preferences.property.bathrooms)) {
                return false;
            }
        }
    
        // Filter by price range
        if (preferences.property.priceRange.min && property.price < preferences.property.priceRange.min) {
            return false;
        }
        if (preferences.property.priceRange.max && property.price > preferences.property.priceRange.max) {
            return false;
        }
        
        // Filter by amenities (property must have ALL selected amenities)
        if (preferences.amenities.length > 0) {
            for (const amenity of preferences.amenities) {
                if (!property.amenities.includes(amenity)) {
                    return false;
                }
            }
        }
        
        return true;
    });
}

// Display properties in the UI
function displayProperties(properties) {
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
    
    // Show no results message if no properties found
    if (properties.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    }
    
    // Sort properties based on selected option
    properties = sortProperties(properties, sortBySelect.value);
    
    // Display properties
    properties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.innerHTML = `
    <div class="property-card">
        <div class="property-image">
            <img src="${property.imageUrl}" alt="${property.title}">
        </div>
        <div class="property-details">
            <h3 class="property-title">${property.title}</h3>
            <p class="property-address">${property.address}</p>
            <div class="property-price">$${property.price}/mo</div>
            <div class="property-features">
                <div class="property-feature">
                    <i class="fas fa-bed"></i> ${property.bedrooms === 'studio' ? 'Studio' : property.bedrooms + ' BR'}
                </div>
                <div class="property-feature">
                    <i class="fas fa-bath"></i> ${property.bathrooms} BA
                </div>
                <div class="property-feature">
                    <i class="fas fa-ruler-combined"></i> ${property.sqft} sqft
                </div>
            </div>
            <div class="property-amenities">
                ${property.amenities.map(amenity => {
                    const amenityLabels = {
                        'parking': 'Parking',
                        'laundry': 'In-unit Laundry',
                        'pets': 'Pet Friendly',
                        'ac': 'AC',
                        'gym': 'Gym',
                        'pool': 'Pool',
                        'furnished': 'Furnished',
                        'mess': 'Mess',
                        'wifi': 'WiFi',
                        'security': 'Security',
                        'dishwasher': 'Dishwasher'
                    };
                    return `<span class="property-amenity">${amenityLabels[amenity]}</span>`;
                }).join('')}
            </div>
            <p class="property-description">${property.description}</p>
            <div class="property-actions">
                <a href="#" class="btn-view" data-id="${property.id}">View Details</a>
                ${property.hasVirtualTour ? `<a href="#" class="btn-virtual-tour" data-id="${property.id}">Virtual Tour ✨</a>` : ""}
                <button class="btn-save" data-id="${property.id}"><i class="far fa-heart"></i></button>
            </div>
        </div>
    </div>
`;


        
        // propertyCard.innerHTML = `
        //     <div class="property-image" style="background-image: url('${property.imageUrl}'); background-size:cover">
        //         <div class="property-price">$${property.price}/mo</div>
        //     </div>
        //     <div class="property-details">
        //         <h3 class="property-title">${property.title}</h3>
        //         <p class="property-address">${property.address}</p>
        //         <div class="property-features">
        //         <div class="property-feature">
        //                 <i class="fas fa-bed"></i> ${property.bedrooms === 'studio' ? 'Studio' : property.bedrooms + ' BR'}
        //             </div>
        //             <div class="property-feature">
        //                 <i class="fas fa-bath"></i> ${property.bathrooms} BA
        //             </div>
        //             <div class="property-feature">
        //                 <i class="fas fa-ruler-combined"></i> ${property.sqft} sqft
        //             </div>
        //         </div>
        //         <div class="property-amenities">
        //             ${property.amenities.map(amenity => {
        //                 const amenityLabels = {
        //                     'parking': 'Parking',
        //                     'laundry': 'In-unit Laundry',
        //                     'pets': 'Pet Friendly',
        //                     'ac': 'AC',
        //                     'gym': 'Gym',
        //                     'pool': 'Pool',
        //                     'furnished': 'Furnished',
        //                     'mess': 'Mess',
        //                     'wifi': 'WiFi',
        //                     'security': 'Security',
        //                     'dishwasher': 'Dishwasher'
        //                 };
        //                 return `<span class="property-amenity">${amenityLabels[amenity]}</span>`;
        //             }).join('')}
        //         </div>
        //         <p>${property.description}</p>
        //         <div class="property-actions">
        //             <a href="#" class="btn-view" data-id="${property.id}">View Details</a>
        //              ${property.hasVirtualTour ? `<a href="#" class="btn-virtual-tour" data-id="${property.id}">Virtual Tour ✨</a>` : ""}
        //             <button class="btn-save" data-id="${property.id}"><i class="far fa-heart"></i></button>
        //         </div>
        //     </div>
        // `;
        
        propertiesList.appendChild(propertyCard);
    });
    
    // Add event listeners to property cards
    addPropertyEventListeners();
}

// Sort properties based on selected option
function sortProperties(properties, sortOption) {
    switch (sortOption) {
        case 'price-asc':
            return properties.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return properties.sort((a, b) => b.price - a.price);
        case 'newest':
            return properties.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        case 'match':
            // In a real app, this would use a match score based on preferences
            return properties;
        default:
            return properties;
    }
}

// Add event listeners to property cards
function addPropertyEventListeners() {
    // View details buttons
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const propertyId = this.getAttribute('data-id');
            alert(`View property details for ID: ${propertyId}`);
            // In a real app, this would navigate to a property details page
        });
    });
    
    // Save property buttons
    document.querySelectorAll('.btn-save').forEach(button => {
        button.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-id');
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Save property
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#e74c3c';
                alert(`Property ${propertyId} saved to favorites!`);
            } else {
                // Remove from saved
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                alert(`Property ${propertyId} removed from favorites!`);
            }
        });
    });
}

// Display error message
function displayError(message) {
    loadingIndicator.style.display = 'none';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <h3>Something went wrong</h3>
        <p>${message}</p>
    `;
    
    propertiesList.innerHTML = '';
    propertiesList.appendChild(errorElement);
}

// Sort by change event
sortBySelect.addEventListener('change', function() {
    // Clear current properties
    propertiesList.innerHTML = '';
    
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    
    // Re-submit the form to get properties with new sorting
    setTimeout(() => {
        rentalForm.dispatchEvent(new Event('submit'));
    }, 500);
});

// View toggle buttons
gridViewButton.addEventListener('click', function() {
    document.body.classList.remove('list-view-active');
    gridViewButton.classList.add('active');
    listViewButton.classList.remove('active');
});

listViewButton.addEventListener('click', function() {
    document.body.classList.add('list-view-active');
    listViewButton.classList.add('active');
    gridViewButton.classList.remove('active');
});

rentalForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(rentalForm);
    const preferences = {
        user: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            moveInDate: formData.get('movein-date')
        },
        location: {
            city: formData.get('city'),
            // neighborhood: formData.get('neighborhood'),
            maxCommuteTime: parseInt(formData.get('commute')) || 0,
            commuteLocation: formData.get('commute-location')
        },
        property: {
            type: formData.get('property-type'),
            bedrooms: formData.get('bedrooms'),
            bathrooms: formData.get('bathrooms'),
            priceRange: {
                min: parseInt(formData.get('min-price')) || null,
                max: parseInt(formData.get('max-price')) || null
            }
        },
        amenities: Array.from(formData.getAll('amenities'))
    };

    // Send data to backend
    try {
        const response = await fetch('/api/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preferences)
        });

        if (response.ok) {
            alert('Preferences saved successfully!');
        } else {
            alert('Error saving preferences.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});




