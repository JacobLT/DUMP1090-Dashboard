# DUMP1090-Dashboard
A dashboard which fetches data from dump1090 and displays it in a beautiful way

This code is far from perfect with many things needed to be tweaked. If you have any issues please report it in the issues tab.

# Features
Dashboard
  - Total tracked planes in the web session open
  - Live aircrafts currently being recieved by DUMP1090
  - Graphs of system usage and messages recieved
Radar
  - Plots planes onto a map to see their position in the sky
  - When the plane is clicked it opens more information about the flight
Live
  - Puts all tracked information into a table to easily read
  - Dynamically changes on the aircrafts that can be tracked

# Configuration
You must edit config.env.example with your DUMP1090 address so it can pull the data. Please ensure that your DUMP1090 data folder where the aircraft.json and stats.json file can be accessed for this programme to obtain the data.
You must also add your own Google API key for Google maps to come out of devleopment mode.
You must change the latitide and longitude to the location of the receiver.
When you have finished editing the config.env.example make sure to remove .example
