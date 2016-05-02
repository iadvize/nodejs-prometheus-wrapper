# Prometheus Wrapper
Wrapper to NodeJS Prometheus client

## WHY

The official NodeJS client for prometheus require to have counters, gauges, histogrammes and summary in global.

This small library allow to control variable just like that: ```require('prometheus-wrapper').inc("<counter-name>")```

## HOW TO


init.js

```javascript
var prometheus		= require("nodejs-prometheus-wrapper");

var express			= require('express');
var app				= express();

prometheus.init("myapp", app);

prometheus.createCounter("mycounter", "A number we occasionally increment.");
prometheus.createGauge("mygauge", "A random number we occasionally set.");

app.listen(8080);
```

my-controller.js

```javascript
var prometheus		= require("prometheus-wrapper");

setInterval(function () {
	prometheus.get("mycounter").inc(42);
}, 10000);

setTimeout(function () {
	prometheus.get("mygauge").set(42);
}, 3000);
```

Exposed /metrics :

```sh
$ curl 127.0.0.1:8080

# HELP myapp_ mycounter A number we occasionally increment.
# TYPE myapp_ mycounter counter
myapp_ mycounter 84

# HELP myapp_mygauge A random number we occasionally set.
# TYPE myapp_mygauge gauge
myapp_mygauge 42

```

