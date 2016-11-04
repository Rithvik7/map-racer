# map-racer
#About
Map Racer 3000 is an addictive retro racing game for ArcGIS written in TypeScript 

#Sample
You can try a live sample of the app at [esriuk.com/mapracer](http://esriuk.com/mapracer).

#Configuring
This app was written in TypeScript, but the repo includes both .ts and compiled .js files. 

The first thing you'll need to is to create your own leaderboard in line 42 of mapRacer.ts (or the equivalent in .js). This is just a simple point feature service in ArcGIS Online/Server.

You can also create your own route by creating a polygon feature service with a single polygon outlining your route. You can add this into line 60 of mapController.ts (or the equivalent in .js). You'll also need to update the staring location in line 49 of mapController.ts.

#Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

#Licensing

Copyright 2016 ESRI (UK) Limited

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the Licence.