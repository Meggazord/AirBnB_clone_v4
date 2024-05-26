$(document).ready(function() {
    let selectedFilters = {
        amenities: {},
        states: {},
        cities: {}
    };

    // Handle changes on checkboxes for amenities, states, and cities
    $('input[type="checkbox"]').change(function() {
        let filterType = $(this).closest('.filters').data('type'); // Assuming each filter section has a data-type attribute
        let isChecked = $(this).is(':checked');
        let filterId = $(this).data('id');
        let filterName = $(this).data('name');

        if (isChecked) {
            selectedFilters[filterType][filterId] = filterName;
        } else {
            delete selectedFilters[filterType][filterId];
        }

        // Update the UI to show selected filters
        let selectedItems = Object.values(selectedFilters[filterType]).join(', ');
        $(this).closest('.filters').find('h4').text(selectedItems);
    });

    // API status check
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Toggle reviews display
    $('.toggle-reviews').click(function() {
        let reviewsContainer = $('.reviews');
        if ($(this).text() === 'show') {
            $(this).text('hide');
            // Fetch and display reviews
            $.ajax({
                url: 'http://0.0.0.0:5001/api/v1/reviews/',
                type: 'GET',
                success: function(reviews) {
                    reviews.forEach(function(review) {
                        reviewsContainer.append(`<div class="review">
                            <p>${review.text}</p>
                        </div>`);
                    });
                }
            });
        } else {
            // Hide reviews
            $(this).text('show');
            reviewsContainer.find('.review').remove();
        }
    });

    // Fetch places based on selected filters
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
                $('.places').empty();
                places.forEach(function(place) {
                    $('.places').append(`<article>
                        <h2>${place.name}</h2>
                        <p>${place.description}</p>
                    </article>`);
                });
            }
        });
    });
});
