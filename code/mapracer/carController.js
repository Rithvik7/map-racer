/**
 * Car Controller has two classes:
 *    Steering - controls the car's steering, taking into account the speed
 *    Speed - controls the cars accelerating, braking and speed
 */
define(["require", "exports"], function (require, exports) {
    // Controls the car's steering system
    var Steering = (function () {
        function Steering(steeringRate, straightenRate, maxSteeringAngle) {
            if (Steering._instance) {
                throw new Error("Instantiation failed because MusicalMap is a singleton class and an instance already exists. Please use getInstance() instead");
            }
            this.steeringInfo = {
                "steeringRate": steeringRate,
                "straightenRate": straightenRate,
                "maxSteeringAngle": maxSteeringAngle
            };
            //defaults 
            this.currentSteeringAngle = 0;
            this.currentMaxSteeringAngle = 90; //starts at 90 degrees when the car is below 1MPH
            this.keyDown = new Array;
            this.keyDown[37] = false; //left
            this.keyDown[39] = false; //right
            //setup speed controller with max speed and rates for acceleratoin, coasting and braking
            //nb: lower numbers make faster rates (how many miliseconds it takes for a rate to update)
            this.speedController = new Speed(100, 75, 125, 30);
            this.speedController.activateSpeed();
            this.initControls();
            Steering._instance = this;
        }
        //returns the singleton instance
        Steering.getInstance = function () {
            return Steering._instance;
        };
        //activates the keyDown array to keep track of key presses
        Steering.prototype.initControls = function () {
            var that = this;
            //listen for keys
            $(document).keydown(function (event) {
                switch (event.keyCode) {
                    case 37:
                        that.keyDown[37] = true;
                        break;
                    case 39:
                        that.keyDown[39] = true;
                        break;
                }
            });
            $(document).keyup(function (event) {
                switch (event.keyCode) {
                    case 37:
                        that.keyDown[37] = false;
                        break;
                    case 39:
                        that.keyDown[39] = false;
                        break;
                }
            });
        };
        //increment the steering angle based on the keypresses and steering rate
        Steering.prototype.activateSteering = function () {
            var that = this;
            var interval = setInterval(function () {
                //calculate currentMaxSteeringAngle based on speed:
                var currentMaxSteeringAngle = that.steeringInfo.maxSteeringAngle - that.speedController.getCurrentSpeed();
                //steer left
                if (that.keyDown[37] == true &&
                    that.keyDown[39] != true &&
                    that.currentSteeringAngle > -currentMaxSteeringAngle) {
                    that.currentSteeringAngle--;
                }
                else if (that.keyDown[39] == true &&
                    that.keyDown[37] != true &&
                    that.currentSteeringAngle < currentMaxSteeringAngle) {
                    that.currentSteeringAngle++;
                }
                else if (that.keyDown[37] != true &&
                    that.keyDown[39] != true &&
                    that.currentSteeringAngle < 0 &&
                    that.currentSteeringAngle >= -that.steeringInfo.maxSteeringAngle) {
                    that.currentSteeringAngle++;
                }
                else if (that.keyDown[39] != true &&
                    that.keyDown[37] != true &&
                    that.currentSteeringAngle > 0 &&
                    that.currentSteeringAngle <= that.steeringInfo.maxSteeringAngle) {
                    that.currentSteeringAngle--;
                }
                //update the car sprite to the relevant angle
                that.updateSprite(that.currentSteeringAngle);
            }, that.steeringInfo.steeringRate);
        };
        //used for speed sensitive steering
        Steering.prototype.setCurrentMaxSteeringAngle = function (angle) {
            this.currentMaxSteeringAngle = angle;
        };
        //returns the current steering angle
        Steering.prototype.getCurrentSteeringAngle = function () {
            return this.currentSteeringAngle;
        };
        //updates the car sprite based on the current steering angle
        Steering.prototype.updateSprite = function (steeringAngle) {
            //straight on
            if (steeringAngle < 8 && steeringAngle > -8) {
                $("#carSprite").attr("src", "../img/carSprites/carSprite0.png");
            }
            else if (steeringAngle > 8) {
                if (steeringAngle > 8 && steeringAngle < 25) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite15.png");
                }
                else if (steeringAngle > 25 && steeringAngle < 45) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite30.png");
                }
                else if (steeringAngle > 45 && steeringAngle < 75) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite45.png");
                }
                else if (steeringAngle > 75 && steeringAngle < 95) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite60.png");
                }
                else if (steeringAngle > 95 && steeringAngle < 110) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite75.png");
                }
                else if (steeringAngle > 110 && steeringAngle < 120) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite90.png");
                }
                else if (steeringAngle > 120 && steeringAngle < 130) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite105.png");
                }
            }
            else if (steeringAngle < -8) {
                if (steeringAngle < -8 && steeringAngle > -25) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite-15.png");
                }
                if (steeringAngle < -25 && steeringAngle > -45) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite-30.png");
                }
                if (steeringAngle < -45 && steeringAngle > -75) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite-45.png");
                }
                if (steeringAngle < -75 && steeringAngle > -95) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite-60.png");
                }
                if (steeringAngle < -95 && steeringAngle > -110) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite-75.png");
                }
                if (steeringAngle < -110 && steeringAngle > -120) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite-90.png");
                }
                if (steeringAngle < -120 && steeringAngle > -130) {
                    $("#carSprite").attr("src", "../img/carSprites/carSprite-105.png");
                }
            }
        };
        //starts up the steering system
        Steering.prototype.start = function () {
            this.activateSteering();
        };
        return Steering;
    }());
    exports.Steering = Steering;
    //Controls the car's acceleration, braking and speed
    var Speed = (function () {
        function Speed(maxSpeed, accelerateRate, coastRate, brakeRate) {
            if (Speed._instance) {
                throw new Error("Instantiation failed because MusicalMap is a singleton class and an instance already exists. Please use getInstance() instead");
            }
            this.currentSpeed = 0;
            this.speedInfo = {
                "maxSpeed": maxSpeed,
                "accelerateRate": accelerateRate,
                "coastRate": coastRate,
                "brakeRate": brakeRate
            };
            this.keyDown = new Array;
            this.enabled = false;
            this.initControls();
            Speed._instance = this;
        }
        //returns the singleton instance
        Speed.getInstance = function () {
            return Speed._instance;
        };
        //returns the car's current speed (used for the speed sensitive steering)
        Speed.prototype.getCurrentSpeed = function () {
            return this.currentSpeed;
        };
        // listenes for key presses and releases
        Speed.prototype.initControls = function () {
            var that = this;
            $(document).keydown(function (event) {
                switch (event.keyCode) {
                    case 38:
                        that.keyDown[38] = true;
                        break;
                    case 40:
                        that.keyDown[40] = true;
                        break;
                }
            });
            $(document).keyup(function (event) {
                switch (event.keyCode) {
                    case 38:
                        that.keyDown[38] = false;
                        break;
                    case 40:
                        that.keyDown[40] = false;
                        break;
                }
            });
        };
        // activates the acceleration, coasting braking and off-track controllers
        Speed.prototype.activateSpeed = function () {
            var that = this;
            var accelerateInterval = setInterval(function () {
                //accelerate
                if (that.enabled && that.keyDown[38] == true && that.currentSpeed < that.speedInfo.maxSpeed && that.offTrack == false) {
                    that.currentSpeed++;
                    that.updateSpeedo(that.currentSpeed);
                }
            }, that.speedInfo.accelerateRate);
            var coastInterval = setInterval(function () {
                //coast
                if (that.enabled && that.keyDown[38] != true && that.keyDown[40] != true && that.currentSpeed > 0 && that.offTrack == false) {
                    that.currentSpeed--;
                    that.updateSpeedo(that.currentSpeed);
                }
            }, that.speedInfo.coastRate);
            var brakeInterval = setInterval(function () {
                //brake
                if (that.enabled && that.keyDown[40] == true && that.keyDown[38] == false && that.currentSpeed > 0 && that.offTrack == false) {
                    that.currentSpeed--;
                    that.updateSpeedo(that.currentSpeed);
                }
            }, that.speedInfo.brakeRate);
            var offTrackInterval = setInterval(function () {
                if (that.offTrack == true) {
                    that.currentSpeed = 15;
                    that.updateSpeedo(that.currentSpeed);
                }
            });
        };
        //updates the speedo in the UI
        Speed.prototype.updateSpeedo = function (currentSpeed) {
            $("#speedo").html(currentSpeed * 4);
        };
        return Speed;
    }());
    exports.Speed = Speed;
});
