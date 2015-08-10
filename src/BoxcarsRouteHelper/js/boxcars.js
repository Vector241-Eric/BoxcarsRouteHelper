var Boxcars = Boxcars || {};

(function() {
    Boxcars.PageSwitchers = (function() {
        var routesId = "#routes-container";
        var destinationsId = "#destinations-container";

        var showRoutes = function() {
            document.getElementById("origin-input").value = "";
            document.getElementById("destination-input").value = "";

            $(destinationsId).hide();
            $(routesId).show();
        };
        var showDestinations = function() {
            $(routesId).hide();
            $(destinationsId).show();
        };

        var attachHandlers = function() {
            $("#btn-routes").click(showRoutes);
            $("#btn-destinations").click(showDestinations);
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
                minLength: 1,
            },
            {
                name: "states",
                source: bloodhound,
                limit: 3
            });
        };

        return {
            attachHandlers: attachHandlers
        };
    })();

    Boxcars.ButtonGroups = (function() {
        var clickHandler = function () {
            var el = $(this);
            var group = el.data("group");
            var selector = '[data-group="' + group + '"]';
            $(selector).addClass("btn-default").removeClass("btn-success");
            el.addClass("btn-success").removeClass("btn-default");
        };

        var attachHandlers = function() {
            $('.grouped-button').click(clickHandler);
        };

        return {
            attachHandlers: attachHandlers
        };
    })();
})();

$(function() {
    Boxcars.PageSwitchers.attachHandlers();
    Boxcars.CityAutoComplete.attachHandlers();
    Boxcars.ButtonGroups.attachHandlers();
});