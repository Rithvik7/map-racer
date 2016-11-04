declare var $:any;
import geometryEngine = require("esri/geometry/geometryEngine");

// Singleton object that manages the car's interaction with the track geometry
export class RouteEngine{ 
    private static _instance:RouteEngine = new RouteEngine();
    private trackGeometry:any;

    constructor() {
        if(RouteEngine._instance){
        } 
        RouteEngine._instance = this;
    }

    public static getInstance():RouteEngine{
        return RouteEngine._instance;
    }

    //If the car is within the track limits, return true
    public monitorTrackLimits(cameraGeometry, trackGeometry){
        return geometryEngine.contains(trackGeometry, cameraGeometry);
    }
}
