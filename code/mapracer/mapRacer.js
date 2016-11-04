/**
 * MAP RACER 3000
 * A RETRO RACING GAME
 * WRITTEN IN TYPESCRIPT USING ESRI'S ARCGIS JAVASCRIPT API
 * PROJECT BY ESRI UK
 **/
define(["require", "exports", "./carController", "./mapController", "./routeEngine"], function (require, exports, Car, MapController, Route) {
    /// <reference path="carController.ts" />
    /// <reference path="mapController.ts" />
    /// <reference path="routeEngine.ts" />
    /// <reference path="raceEngine.ts" />
    /**
     * THIS IS THE MAIN MAP RACER CLASS THAT ORCHESTRATES THE GAME LOGIC
     * IT IS INSTANTIATED AS A SINGLETON OBJECT
     **/
    var MapRacer = (function () {
        function MapRacer() {
            if (MapRacer._instance) {
                throw new Error("Instantiation failed because MapRacer is a singleton class and an instance already exists. Please use getInstance() instead");
            }
            MapRacer._instance = this;
            this._steering = new Car.Steering(5, 5, 130);
            this._mapController = new MapController.MapController();
            this._routeEngine = Route.RouteEngine.getInstance();
            this._speed = Car.Speed.getInstance();
            this._leaderboardUrl = ""; //***PLEASE ADD THE SERVICE ENDPOINT TO YOUR POINT FEATURE SERVICE HERE***
            this.startGame();
        }
        //returns the singleton instance
        MapRacer.getInstance = function () {
            return MapRacer._instance;
        };
        MapRacer.prototype.startGame = function () {
            var that = this;
            //Prime the game
            that.updateLeaderboard();
            that.activateButtons();
            that._steering.start();
            that.monitorTrackLimits();
            //Start the game
            $("#startButton").click(function () {
                $("#leaderboardButton").attr("disabled", true);
                $('#startButton').attr("disabled", true);
                var mySound = new Audio("music.mp3");
                mySound.play();
                var countdown = 4; //The coutdown to the start of the race
                var raceTime = 63; //The length of the race in seconds 
                var score = 0; //The rolling score
                //Counts down the countdown variable before the race begins
                var countdownInt = setInterval(function () {
                    if (countdown > 1) {
                        countdown--;
                        $("#startButton").html(countdown);
                    }
                    else {
                        $("#startButton").html("GO!!!!");
                        that._speed.enabled = true;
                        $("#startButton").css('display', 'none');
                        clearInterval(countdownInt);
                    }
                }, 800); //(800 to sync with the music)
                //Increment the score based on the current speed
                var scoreInt = setInterval(function () {
                    score = score + parseInt($("#speedo").text());
                    $("#score").html(score);
                }, 250);
                //Counts down the raceTime variable
                //Stops the race when the race timer reaches 0
                var raceInt = setInterval(function () {
                    raceTime--;
                    if (raceTime < 91 && raceTime > 0) {
                        $("#raceTime").html(raceTime);
                    }
                    else if (raceTime <= 1) {
                        //Set the game to it's finished state
                        clearInterval(raceInt);
                        clearInterval(scoreInt);
                        that._speed.enabled = false;
                        that._speed.currentSpeed = 60;
                        $("#raceTime").html(0);
                        $("#viewDiv").css('webkit-filter', "saturate(9) hue-rotate(220deg) invert(0) opacity(1) brightness(0.5) contrast(0.9)");
                        $("#car").css('display', 'none');
                        that.getLeaderboardEntry(); //Let the user submit their score
                    }
                }, 1000);
            });
        };
        //Sets up the event listeners for the leaderboard and try again buttons
        MapRacer.prototype.activateButtons = function () {
            $("#tryagainButton").click(function () {
                location.reload();
            });
            $("#leaderboardButton").click(function () {
                // if the leader board is visible....
                if ($("#leaderboard").css('display') == "none") {
                    $("#leaderboard").css('display', 'block');
                    $("#leaderboardTable").css('display', 'table');
                    $("#startButton").css('display', 'none');
                    $("#viewDiv").css('webkit-filter', "saturate(9) hue-rotate(220deg) invert(0) opacity(1) brightness(0.5) contrast(0.9)");
                }
                else {
                    $("#leaderboard").css('display', 'none');
                    $("#leaderboardTable").css('display', 'none');
                    $("#startButton").css('display', 'block');
                    $("#viewDiv").css('webkit-filter', "saturate(9) hue-rotate(220deg) invert(0) opacity(1) brightness(1) contrast(0.9)");
                }
            });
        };
        //Gets the latest scores from the server and updates the local UI elements
        MapRacer.prototype.updateLeaderboard = function () {
            var highScoreObj = $.ajax({
                type: "POST",
                url: this._leaderboardUrl + "/query?",
                data: {
                    where: "1=1",
                    outFields: "*",
                    orderByFields: "SCORE DESC",
                    f: 'json',
                },
                dataType: "json"
            }).done(function () {
                //this is the leaderboard
                var highScoreJson = JSON.parse(highScoreObj.responseText);
                $('#highscore').html(highScoreJson.features[0].attributes.SCORE);
                for (var i = 0; i < 10; i++) {
                    $("#name" + (i + 1)).html(highScoreJson.features[i].attributes.NAME);
                    $("#score" + (i + 1)).html(highScoreJson.features[i].attributes.SCORE);
                }
            });
        };
        //Checks whether the car is within the track limits every 200ms
        MapRacer.prototype.monitorTrackLimits = function () {
            var that = this;
            window.setInterval(function () {
                //If the car has left the track
                if (that._routeEngine.monitorTrackLimits(that._mapController.getCurrentCameraPosition(), that._mapController.getTrackGeometry()) == false) {
                    that._steering.speedController.offTrack = true; //sets a flag to put the car into off-track mode 
                }
                else {
                    that._steering.speedController.offTrack = false; //continue as normal 
                }
            }, 200);
        };
        // Lets the user enter their name and submit their score to the leaderboard
        MapRacer.prototype.getLeaderboardEntry = function () {
            var that = this;
            //show entry screen
            $("#scoreEntry").css('display', 'block');
            $("#scoreName").css('display', 'inline-block');
            $("#scoreName").css('display', 'inline-block').focus();
            $("#submitButton").css('display', 'inline-block');
            //post high score 
            $("#submitButton").click(function () {
                $("#scoreEntry").css('display', 'none');
                $("#scoreName").css('display', 'none');
                $("#submitButton").css('display', 'none');
                //describes a new feature at an arbitrary location with dynamic name and score attributes 
                var submitObj = '[{"geometry":{"x":-90023.93297766997,"y":6766433.934712283,"spatialReference":{"wkid":102100,"latestWkid":3857}},"attributes":{"NAME":"' + $("#scoreName").val() + '","SCORE":' + $("#score").text() + '}}]';
                //Add the new 'submitObj' feature to the feature class
                $.ajax({
                    type: "POST",
                    url: that._leaderboardUrl + "/applyEdits?",
                    data: {
                        f: 'json',
                        adds: submitObj
                    },
                    dataType: "json"
                }).done(function () {
                    //Update the leaderboard to the latest version (which could contain the score that's just been submitted)
                    that.updateLeaderboard();
                    $("#leaderboard").css('display', 'block');
                    $("#leaderboardTable").css('display', 'table');
                });
            });
        };
        MapRacer._instance = new MapRacer();
        return MapRacer;
    }());
    exports.MapRacer = MapRacer;
});
