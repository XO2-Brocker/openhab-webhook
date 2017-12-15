# openhab-webhook
A nodejs webhook server to use Locative &amp; Geofency iOS apps to conrol OpenHAB presence items.<br>
When a geofence or iBeacon is entered/exited, ON/OFF command is sent.

No authenication is implemented.

## Getting Started
### Prerequisites
Nodejs  
NPM  
PM2 (Optional. For running node apps as a background services)

Update your local package index:
```
sudo apt-get update
```

Install Node.js:
```
sudo apt-get install nodejs
```

The nodejs-legacy package installs a node symlink that is needed by many modules (including openhab-webhook) to build and run correctly.
```
sudo apt-get install nodejs-legacy
```

Install NPM (Node Package Manager):
```
sudo apt-get install npm
```

### Installation
Install openhab-webhook from NPM:
```
sudo npm install openhab-webhook -g
```

By default, the OpenHAB server is set to localhost at port 8080, and the webhook listener listens on port 8000.<br>
To change this, edit the *settings.json* file in */usr/local/lib/node/openhab-webhook*


## Test it!

Run openhab-webhook in terminal:
```
openhab-webhook
```
It should print out what port the webhook listener is running on, and the OpenHAB connection status.<br>
You should be able to visit *serverip:8000* from a browser.<br>
(to quit, hit *Ctrl + C*)

### Locative (iOS app) configuration
In *GLOBAL HTTP SETTINGS* on the settings page:
* Set the URL to: ```http://serverip:8000```
* Select *POST* and leave *HTTP Basic Authentication* off.

When you add a Geofence or iBeacon:
* Give *Custom Location ID* or *Custom iBeacon ID* the same name as the item you want to switch ON/OFF in OpenHAB.
* Set *Trigger on Arrival* and *Trigger on Departure* on/off as desired.
* Don't edit the url, this way it will use the global url you set in *GLOBAL HTTP SETTINGS*.

### Geofency (iOS app) configuration
* Add an iBeacon
* Tap the **&#8942;** menu button on that iBeacon, then tap *Edit Name* and make this the same name as the item you want to switch ON/OFF in OpenHAB.
* Tap the **&#8942;** again, then tap *Webhook*
* Tap *Event &#8594; URL Settings*
* Set *Notify on Entry* and *Notify on Exit* on/off as desired.
* Set both *URL*s to ```http://serverip:8000```
* Leave *POST Format* on *Default*

### Proximity Events (iOS app)
(Implemented, but not tested)


## Run as background service with PM2
Install PM2 to run node apps as background services:
```
sudo npm install pm2 -g
```
start openhab-webhook as service with PM2:
```
pm2 start openhab-webhook
```

Generate PM2 startup script:
```
sudo pm2 startup
```

### How the PM2 startup script works
The PM2 startup script that starts your Node applications, (called 'pm2-init.sh.') lives in the 'etc/init.d/' directory. It does not specically start openhab-webhook. Instead, it starts the programs that were running under PM2 the last time the server shutdown.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
