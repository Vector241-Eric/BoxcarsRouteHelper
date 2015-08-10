﻿var Boxcars = Boxcars || {};

(function() {
    Boxcars.PageSwitchers = (function() {
        var attachHandlers = function() {
            $("#btn-routes").click(function() {
                $("#destinations-container").hide();
                $("#routes-container").show();
            });
            $("#btn-destinations").click(function() {
                $("#routes-container").hide();
                $("#destinations-container").show();
            });
        };
        return {
            attachHandlers: attachHandlers
        };
    })();

    Boxcars.CityAutoComplete = (function() {
        var states = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California",
            "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii",
            "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
            "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
            "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
            "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
            "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
            "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
            "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ];

        // constructs the suggestion engine
        var bloodhound = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            local: states
        });

        var attachHandlers = function() {
            $("input.city-complete").typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: "states",
                source: bloodhound
            });
        };

        return {
            attachHandlers: attachHandlers
        };
    })();
})();

$(function() {
    Boxcars.PageSwitchers.attachHandlers();
    Boxcars.CityAutoComplete.attachHandlers();
});