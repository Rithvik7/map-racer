/**
 * Singleton object that creates and manages the scene view
 */

/// <reference path="../typings/arcgis-js-api.d.ts"/>

import esri = require("esri");
import Map = require("esri/Map");
import Camera = require("esri/Camera");
import SceneView = require("esri/views/SceneView");
import webMercatorUtils = require("esri/geometry/support/webMercatorUtils");
import Point = require("esri/geometry/Point");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Car = require("./carController");

export class MapController{ 
    private static _instance:MapController;

    private _steeringController:Car.Steering;
    private _speedController:Car.Speed;
    private heading:number;
    private view:SceneView;
    private currentCameraGeometry:any;
    private trackGeometry:any;

    constructor() {
        if(MapController._instance){
            throw new Error("Instantiation failed because MapController is a singleton class and an instance already exists. Please use getInstance() instead");
        }
        MapController._instance=this;
        this._steeringController = Car.Steering.getInstance();
        this._speedController = Car.Speed.getInstance();
        this.setupScene();
    }

    //returns the singleton instance
    public static getInstance():MapController{
        return MapController._instance;
    }

    // Create a new web scene and add the track geometry
    private setupScene(){
        var that = this;
        that.view = new SceneView({
            map: new Map({
            basemap: "satellite"
            }),
            container: "viewDiv",
            camera: {
                position: [-0.7541657654127752, 51.807172545720825, 80],
                tilt: 65,
                heading: 71.53750003858396,
            }
        });
        that.view.ui.remove(["compass","zoom"]);

        that.view.then(function() {
            that.heading = that.view.camera.heading;
            var fl = new FeatureLayer({
                url: "http://services.arcgis.com/Qo2anKIAMzIEkIJB/arcgis/rest/services/MapRacerSingleLane2/FeatureServer/0",
                visible:false
            });
            fl.then(function getGeoms(evt){
                fl.queryFeatures().then(function(results){
                    that.trackGeometry = results.features[0].geometry;
                    that.start();
                });
            });
            that.view.map.add(fl);  // adds the layer to the map
        })
        .otherwise(function(err) {
            // A rejected view indicates a fatal error making it unable to display,
            // this usually means that WebGL is not available, or too old.
            console.error("SceneView rejected:", err);
        });
    }

    //Gets the current camera position (used by MapRacer class to check the track limits)
    public getCurrentCameraPosition(){
        return this.currentCameraGeometry;
    }

    //Gets the track geometry (used by MapRacer class to check the track limits)
    public getTrackGeometry(){
        return this.trackGeometry;
    }
    
    // Advances the position of the camera in the scene based on the car's current speed and heading
    private advancePosition(spd, hdg){
        var that = this;

        //lats and longs have to be converted to x and y
        //this is so we can calculate on a linnear measurement
        var longlat = webMercatorUtils.lngLatToXY(that.view.camera.position.longitude, that.view.camera.position.latitude);
        var long = longlat[0];
        var lat = longlat[1];
        var heading = hdg;
        
        // Normalise rotations above or below 360 degrees
        // ArcGIS simply increments degrees forever if you are driving in a circle 
        //359...360...361.......1081...
        if (heading >360){
            while (heading >360){
                heading = heading - 360;
            }
        }
        if (heading <0){
            while (heading <0){
                heading = heading + 360;
            }
        }

        // advance the position of the camera in the scene
        // there is a clause for each 90 degree increment
        // this is to split the ratio of movement into forward and side movement 
        if (heading >=0 && heading <=90){
            lat = lat + ((90 - heading)*spd/200);
            long = long + (heading*spd/200);
        } 
        else if (heading >90 && heading <=180){
            lat = lat - ((heading - 90)*spd/200);
            long = long + ((180 - heading)*spd/200);
        }
        else if (heading >180 && heading <=270){
            lat = lat - ((270 - heading)*spd/200);
            long = long - ((heading - 180)*spd/200);   
        }
        else if (heading >270 && heading <=359){
            lat = lat + ((heading - 270)*spd/200);
            long = long - ((360-heading)*spd/200);
        }
         
        that.currentCameraGeometry = new Point({
            x: long, 
            y: lat,     
            z: 30,   
        });

        // convert the temporary x and y back to lat and long
        var newLocation = webMercatorUtils.xyToLngLat(long,lat);
        
        // move to the new calculated location 
        var cam = new Camera({
        position: new Point({
            x: newLocation[0], // lon
            y: newLocation[1],      // lat
            z: 5,   
        }),
            heading: heading, 
            tilt: 75     
        });
        that.view.goTo(cam);
    }

    //updates the car's position every 50ms
    public start(){
        var that = this;
        var interval = setInterval(function(){
            var steeringAngle = that._steeringController.getCurrentSteeringAngle()
            that.setHeading(steeringAngle); 
            that.advancePosition(that._speedController.getCurrentSpeed(), that.heading);
        },50);
    }
    
    //Sets the heading based on the car's current steering angle
    private setHeading(strAng){
        if(this._speedController.getCurrentSpeed()>1){
            this.heading = this.heading + strAng/80;
        }
    }
}
