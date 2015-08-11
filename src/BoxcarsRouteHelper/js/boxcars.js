var Boxcars = Boxcars || {};

(function() {
    Boxcars.PageSwitchers = (function() {
        var routesId = "#routes-container";
        var destinationsId = "#destinations-container";
        var showRoutesCallback;
        var showDestinationsCallback;

        var showRoutes = function() {
            if (showRoutesCallback && typeof (showRoutesCallback) === "function")
                showRoutesCallback();

            $(destinationsId).hide();
            $(routesId).show();
        };

        var showDestinations = function() {
            if (showDestinationsCallback && typeof (showDestinationsCallback) === "function")
                showDestinationsCallback();

            $(routesId).hide();
            $(destinationsId).show();
        };

        var attachHandlers = function() {
            $("#btn-routes").click(showRoutes);
            $("#btn-destinations").click(showDestinations);
        };

        var onShowRoutes = function(callback) {
            showRoutesCallback = callback;
        };
        var onShowDestinations = function(callback) {
            showDestinationsCallback = callback;
        };
        return {
            attachHandlers: attachHandlers,
            onShowRoutes: onShowRoutes,
            onShowDestinatations: onShowDestinations
        };
    })();

    Boxcars.Util = (function() {
        var getInputValue = function(id) {
            return document.getElementById(id).value;
        };

        var handleTypeaheadChange = function(id, handler) {
            $("#" + id)
                .on("change", handler)
                .bind("typeahead:select", handler)
                .bind("typeahead:change", handler);
        };

        return {
            getInputValue: getInputValue,
            handleTypeaheadChange: handleTypeaheadChange
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
                source: bloodhound,
                limit: 3
            });
        };

        return {
            attachHandlers: attachHandlers
        };
    })();

    Boxcars.Destinations = (function() {

        var originId = "input-destinations-origin";
        var buttonGroups = (function() {

            var selectedClass = "btn-success";
            var unselectedClass = "btn-default";
            var changeHandler;

            var getSelectorForGroup = function(groupName) {
                return ".grouped-button[data-group=\"" + groupName + "\"]";
            };
            var clearGroup = function(groupName) {
                $(getSelectorForGroup(groupName)).addClass(unselectedClass).removeClass(selectedClass);
            };
            var clear = function() {
                clearGroup("region");
                clearGroup("city");
            };
            var setSelectedClasses = function(el) {
                var groupName = el.data("group");
                clearGroup(groupName);
                el.addClass(selectedClass).removeClass(unselectedClass);
            };
            var clickHandler = function() {
                setSelectedClasses($(this));
                if (changeHandler && typeof (changeHandler) === "function") {
                    changeHandler();
                }
            };

            var getSelectedForGroup = function(groupName) {
                var selector = getSelectorForGroup(groupName) + "." + selectedClass;
                var button = $(selector);
                if (button.length === 0)
                    return "none";
                return button.data("oddeven");
            };
            var getSelected = function() {
                var region = getSelectedForGroup("region");
                var city = getSelectedForGroup("city");
                var allValid = region !== "none" && city !== "none";

                return {
                    region: region,
                    city: city,
                    allValid: allValid
                };
            };
            var attachHandlers = function() {
                $(".grouped-button").click(clickHandler);
            };

            var onChange = function(handler) {
                changeHandler = handler;
            };
            return {
                attachHandlers: attachHandlers,
                getSelected: getSelected,
                clear: clear,
                onChange: onChange
            };
        })();

        var regionRollId = "input-destinationregion";
        var cityRollId = "input-destinationcity";

        var setDestinationValue = function(val) {
            document.getElementById("destination-output").innerHTML = val;
        };

        var setRouteValue = function(val) {
            document.getElementById("output-destination-routeValue").innerHTML = val;
        };
        var clear = function() {
            buttonGroups.clear();
            setDestinationValue("&nbsp;");
            setRouteValue("&nbsp;");
            document.getElementById(regionRollId).value = "";
            document.getElementById(cityRollId).value = "";
            $("#" + originId).typeahead("val", "");
        };

        var getDestinationKey = function(regionOddEven, regionNumber, cityOddEven, cityNumber) {
            return "R:" + regionOddEven + ":" + regionNumber + "-C:" + cityOddEven + ":" + cityNumber;

        };

        var onValueChanged = function() {
            var buttons = buttonGroups.getSelected();
            var regionRoll = Boxcars.Util.getInputValue(regionRollId);
            var cityRoll = Boxcars.Util.getInputValue(cityRollId);

            var hasAllDestinationInput = buttons.allValid
                && regionRoll !== ""
                && cityRoll !== "";

            if (!hasAllDestinationInput)
                return 0;

            var destination = getDestinationKey(buttons.region, regionRoll, buttons.city, cityRoll);
            setDestinationValue(destination);

            var origin = Boxcars.Util.getInputValue(originId);
            if (origin !== "") {
                var routeValue = Boxcars.Routes.getRouteValue(origin, destination);
                setRouteValue(routeValue);
            }
            return 1;
        };

        var attachHandlers = function() {
            buttonGroups.attachHandlers();
            buttonGroups.onChange(onValueChanged);
            $("#" + regionRollId).on("change", onValueChanged);
            $("#" + cityRollId).on("change", onValueChanged);
            Boxcars.Util.handleTypeaheadChange(originId, onValueChanged);
        };

        return {
            attachHandlers: attachHandlers,
            clear: clear
        };
    })();

    Boxcars.Routes = (function() {
        var originId = "origin-input";
        var destinationId = "destination-input";


        var setOutput = function(text) {
            document.getElementById("route-output").innerHTML = text;
        };

        var clear = function() {
            $("#" + originId).typeahead("val", "");
            $("#" + destinationId).typeahead("val", "");
            setOutput("&nbsp;");
        };

        var getRouteValue = function(origin, destination) {
            return origin + "-" + destination;
        };
        var onChange = function() {
            var origin = Boxcars.Util.getInputValue(originId);
            var destination = Boxcars.Util.getInputValue(destinationId);

            var hasAllInput = origin !== ""
                && destination !== "";

            if (!hasAllInput)
                return 0;

            var key = getRouteValue(origin, destination);
            setOutput(key);

            return 1;
        };
        var attachHandlers = function() {
            Boxcars.Util.handleTypeaheadChange(originId, onChange);
            Boxcars.Util.handleTypeaheadChange(destinationId, onChange);
        };

        return {
            attachHandlers: attachHandlers,
            clear: clear,
            getRouteValue: getRouteValue
        };
    })();
})();

$(function() {
    Boxcars.CityAutoComplete.attachHandlers();

    Boxcars.PageSwitchers.attachHandlers();
    Boxcars.PageSwitchers.onShowRoutes(Boxcars.Routes.clear);
    Boxcars.PageSwitchers.onShowDestinatations(Boxcars.Destinations.clear);

    Boxcars.Routes.attachHandlers();
    Boxcars.Destinations.attachHandlers();
});