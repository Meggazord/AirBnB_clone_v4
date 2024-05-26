$(document).ready(function() {
    let selectedFilters = {
        amenities: {},
        states: {},
        cities: {}
    };

    // Handling changes on checkboxes for amenities, states, and cities
    $('.filters input[type="checkbox"]').change(function() {
        let containerClass = $(this).closest('div').attr('class'); // This can be 'amenities', 'states', or 'cities'
        let id = $(this).data('id');
        let name = $(this).data('name');

        if (this.checked) {
            selectedFilters[containerClass][id] = name;
        } else {
            delete selectedFilters[containerClass][id];
        }

        // Displaying the selected filters in the UI under the respective category
        let filterNames = Object.values(selectedFilters[containerClass]).join(', ');
        $(this).closest('div').find('h4').text(filterNames);
    });

    // Checking the status of the API when the document is ready and updating the UI accordingly
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Fetching places according to the selected filters when the search button is clicked
    $('button').click(function() {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                amenities: Object.keys(selectedFilters.amenities),
                states: Object.keys(selectedFilters.states),
                cities: Object.keys(selectedFilters.cities)
            }),
            success: function(places) {
                $('.places').empty(); // Clearing the places section before adding new ones
                places.forEach(function(place) {
                    // Constructing HTML for each place and appending to the places section
                    let placeHtml = `<article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>
                        </div>
                        <div class="description">
                            ${place.description}
                        </div>
                    </article>`;
                    $('.places').append(placeHtml);
                });
            }
        });
    });
});
