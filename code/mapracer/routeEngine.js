define(["require", "exports", "esri/geometry/geometryEngine"], function (require, exports, geometryEngine) {
    // Singleton object that manages the car's interaction with the track geometry
    var RouteEngine = (function () {
        function RouteEngine() {
            if (RouteEngine._instance) {
                throw new Error("Instantiation failed because RouteEngine is a singleton class and an instance already exists. Please use getInstance() instead");
            }
            RouteEngine._instance = this;
        }
        RouteEngine.getInstance = function () {
            return RouteEngine._instance;
        };
        //If the car is within the track limits, return true
        RouteEngine.prototype.monitorTrackLimits = function (cameraGeometry, trackGeometry) {
            return geometryEngine.contains(trackGeometry, cameraGeometry);
        };
        RouteEngine._instance = new RouteEngine();
        return RouteEngine;
    }());
    exports.RouteEngine = RouteEngine;
});
