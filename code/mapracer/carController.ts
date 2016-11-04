/**
 * Car Controller has two classes: 
 *    Steering - controls the car's steering, taking into account the speed
 *    Speed - controls the cars accelerating, braking and speed
 */

declare var $: any;

// Controls the car's steering system
export class Steering{
    private static _instance:Steering; 

    private keyDown: boolean[]; //an array of which controls are currently pressed
    private steeringInfo:any; //an object that stores the constants that tune the steering system's behaviour
    private currentMaxSteeringAngle: number; //stores the maximum steering angle at the current speed
    private currentSteeringAngle: number; //stores the current steering angle 
    public speedController:Speed; //used to mediate the speed sensitive nature of the steering

    constructor(steeringRate:number, straightenRate: number, maxSteeringAngle:number){
        if(Steering._instance){
            throw new Error("Instantiation failed because Steering is a singleton class and an instance already exists. Please use getInstance() instead");
        }
        
        this.steeringInfo = {
            "steeringRate": steeringRate,
            "straightenRate": straightenRate,
            "maxSteeringAngle": maxSteeringAngle
        };

        //defaults 
        this.currentSteeringAngle = 0;
        this.currentMaxSteeringAngle = this.steeringInfo.maxSteeringAngle;

        this.keyDown = new Array; 
        this.keyDown[37] = false; //left
        this.keyDown[39] = false; //right

        //setup speed controller with max speed and rates for acceleratoin, coasting and braking
        //nb: lower numbers make faster rates (how many miliseconds it takes for a rate to update)
        this.speedController = new Speed(100,75,125,30); 
        this.speedController.activateSpeed();

        this.initControls();
        Steering._instance = this;
    }

    //returns the singleton instance
    public static getInstance():Steering{
        return Steering._instance;
    }

    //activates the keyDown array to keep track of key presses
    private initControls(){
        var that = this;
        //listen for keys
        $(document).keydown(function(event) {
            switch (event.keyCode) {
                case 37:
                    that.keyDown[37] = true;
                    break;
                case 39:
                    that.keyDown[39] = true;
                    break;
            }
        });
        
        $(document).keyup(function(event){
            switch (event.keyCode) {
                case 37:
                    that.keyDown[37] = false;
                    break;
                case 39:
                    that.keyDown[39] = false;
                    break;
            }     
        });
    }

    //increment the steering angle based on the keypresses and steering rate
    private activateSteering(){
        var that = this;
        var interval = setInterval(function(){
            //calculate currentMaxSteeringAngle based on speed:
            var currentMaxSteeringAngle = that.steeringInfo.maxSteeringAngle - that.speedController.getCurrentSpeed();

            //steer left
            if (that.keyDown [37] == true && 
                that.keyDown[39] != true && 
                that.currentSteeringAngle > -currentMaxSteeringAngle){

                that.currentSteeringAngle--;
            }

            //steer right
            else if (that.keyDown [39] == true && 
                that.keyDown[37] != true && 
                that.currentSteeringAngle < currentMaxSteeringAngle){

                that.currentSteeringAngle++;
            }

            //straightenfromLeft
            else if (that.keyDown [37] != true && 
                that.keyDown[39] != true && 
                that.currentSteeringAngle<0 && 
                that.currentSteeringAngle >= -that.steeringInfo.maxSteeringAngle){

                that.currentSteeringAngle++;
            }

            //straightenFromRight
            else if (that.keyDown [39] != true && 
                that.keyDown[37] != true && 
                that.currentSteeringAngle>0 && 
                that.currentSteeringAngle <= that.steeringInfo.maxSteeringAngle){
                    
                that.currentSteeringAngle--;
            }
            //update the car sprite to the relevant angle
            that.updateSprite(that.currentSteeringAngle);
        }, that.steeringInfo.steeringRate); 
    }


    //used for speed sensitive steering
    public setCurrentMaxSteeringAngle(angle){
        this.currentMaxSteeringAngle = angle;
    }

    //returns the current steering angle
    public getCurrentSteeringAngle(){
        return this.currentSteeringAngle;
    }

    //updates the car sprite based on the current steering angle
    private updateSprite(steeringAngle){
        //straight on
        if (steeringAngle <8 && steeringAngle >-8){
            $("#carSprite").attr("src", "../img/carSprites/carSprite0.png");
        }

        //steering right
        else if (steeringAngle >8){
            if(steeringAngle >8 && steeringAngle <25){
                $("#carSprite").attr("src", "../img/carSprites/carSprite15.png");
            }
            else if(steeringAngle >25 && steeringAngle <45){
                $("#carSprite").attr("src", "../img/carSprites/carSprite30.png");
            }
            else if(steeringAngle >45 && steeringAngle <75){
                $("#carSprite").attr("src", "../img/carSprites/carSprite45.png");
            }
            else if(steeringAngle >75 && steeringAngle <95){
                $("#carSprite").attr("src", "../img/carSprites/carSprite60.png");
            }
            else if(steeringAngle >95 && steeringAngle <110){
                $("#carSprite").attr("src", "../img/carSprites/carSprite75.png");
            }
            else if(steeringAngle >110 && steeringAngle <120){
                $("#carSprite").attr("src", "../img/carSprites/carSprite90.png");
            }
            else if(steeringAngle >120 && steeringAngle <130){
                $("#carSprite").attr("src", "../img/carSprites/carSprite105.png");
            }  
        }

        //steering left      
        else if (steeringAngle <-8){
            if(steeringAngle <-8 && steeringAngle >-25){
                $("#carSprite").attr("src", "../img/carSprites/carSprite-15.png");
            }
            if(steeringAngle <-25 && steeringAngle >-45){
                $("#carSprite").attr("src", "../img/carSprites/carSprite-30.png");
            }
            if(steeringAngle <-45 && steeringAngle >-75){
                $("#carSprite").attr("src", "../img/carSprites/carSprite-45.png");
            }
            if(steeringAngle <-75 && steeringAngle >-95){
                $("#carSprite").attr("src", "../img/carSprites/carSprite-60.png");
            }
            if(steeringAngle <-95 && steeringAngle >-110){
                $("#carSprite").attr("src", "../img/carSprites/carSprite-75.png");
            }
            if(steeringAngle <-110 && steeringAngle >-120){
                $("#carSprite").attr("src", "../img/carSprites/carSprite-90.png");
            }
            if(steeringAngle <-120 && steeringAngle >-130){
                $("#carSprite").attr("src", "../img/carSprites/carSprite-105.png");
            }
        }
    }

    //starts up the steering system
    public start(){
        this.activateSteering();
    }
}


//Controls the car's acceleration, braking and speed
export class Speed{
    private static _instance:Speed; 

    private keyDown: boolean[]; //a boolean array to store which keys are bring pressed
    public currentSpeed:number; //the car's current speed
    private speedInfo:any; //an object to store the constants that tune the car's characteristics 
    public offTrack:boolean; //a flag to enable the off-track mode
    public enabled:boolean; //a flag to enable and disable the car's accelerator
    

    constructor(maxSpeed:number, accelerateRate:number, coastRate:number, brakeRate:number){
        if(Speed._instance){
            throw new Error("Instantiation failed because Speed is a singleton class and an instance already exists. Please use getInstance() instead");
        }
        this.currentSpeed = 0;
        this.speedInfo = {
            "maxSpeed": maxSpeed,
            "accelerateRate": accelerateRate,
            "coastRate":coastRate,
            "brakeRate": brakeRate
        };
        this.keyDown = new Array;
        this.enabled = false;
        this.initControls();
        Speed._instance = this;
    }

    //returns the singleton instance
    public static getInstance():Speed{
        return Speed._instance;
    }

    //returns the car's current speed (used for the speed sensitive steering)
    public getCurrentSpeed(){
        return this.currentSpeed;
    }

    // listenes for key presses and releases
    private initControls(){
        var that = this;
        $(document).keydown(function(event) {
            switch (event.keyCode) {
                case 38:
                    that.keyDown[38] = true;
                    break;
                case 40:
                    that.keyDown[40] = true;
                    break;
            }
        });
        
        $(document).keyup(function(event){
            switch (event.keyCode) {
                case 38:
                    that.keyDown[38] = false;
                    break;
                case 40:
                    that.keyDown[40] = false;
                    break;
            }     
        });
    }

    // activates the acceleration, coasting braking and off-track controllers
    public activateSpeed(){
        var that = this;

        var accelerateInterval = setInterval(function(){
            //accelerate
            if (that.enabled && that.keyDown[38] == true && that.currentSpeed<that.speedInfo.maxSpeed&&that.offTrack==false){
                that.currentSpeed++;
                that.updateSpeedo(that.currentSpeed);
            }
        },that.speedInfo.accelerateRate);

        var coastInterval = setInterval(function(){
            //coast
            if (that.enabled && that.keyDown [38] != true && that.keyDown[40] != true && that.currentSpeed>0&&that.offTrack==false){
                that.currentSpeed--;
                that.updateSpeedo(that.currentSpeed);
            }
        },that.speedInfo.coastRate);

        var brakeInterval = setInterval(function(){
            //brake
            if (that.enabled && that.keyDown[40] == true && that.keyDown[38] == false && that.currentSpeed>0&&that.offTrack==false){
                that.currentSpeed--;
                that.updateSpeedo(that.currentSpeed);
            }
        }, that.speedInfo.brakeRate); 

        var offTrackInterval = setInterval(function(){
            if(that.offTrack == true){
                that.currentSpeed = 15;
                that.updateSpeedo(that.currentSpeed);
            }
        });
    }

    //updates the speedo in the UI
    private updateSpeedo(currentSpeed){
        $("#speedo").html(currentSpeed*4);
    }
}
