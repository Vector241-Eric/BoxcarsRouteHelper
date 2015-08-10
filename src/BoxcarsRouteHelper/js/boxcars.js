var Boxcars = Boxcars || {};

(function () {
    Boxcars.PageSwitchers = (function () {
        var attachHandlers = function() {
            $('#btn-routes').click(function() {
                $('#destinations-container').hide();
                $('#routes-container').show();
            });
            $('#btn-destinations').click(function() {
                $('#routes-container').hide();
                $('#destinations-container').show();
            });
        };
        return {
            attachHandlers: attachHandlers
        }
    })();
})();

$(function() {
    Boxcars.PageSwitchers.attachHandlers();
});