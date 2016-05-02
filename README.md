# NodeJS Prometheus Wrapper
Wrapper to NodeJS Prometheus client ([prom-client](https://github.com/siimon/prom-client))

## WHY

The official NodeJS client for prometheus require to have counters, gauges, histograms and summaries in global.

This small library allow to control variables just like that: ```require('prometheus-wrapper').get("<counter-name>").inc()```

## HOW TO


init.js

```javascript
var prometheus		= require("nodejs-prometheus-wrapper");

var express			= require('express');
var app				= express();

prometheus.init("myapp", app);

prometheus.createCounter("mycounter", "A number we occasionally increment.");
prometheus.createGauge("mygauge", "A random number we occasionally set.");
prometheus.createHistogram("myhistogram", "A chat duration histogram.", {
	buckets: [ 10, 30, 60, 300, 600, 1800, 3600 ]
});

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

var end = prometheus.get("myhistogram").startTimer();
setTimeout(function () {
	end();
}, 15000);
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

# HELP myapp_myhistogram A chat duration histogram.
# TYPE myapp_myhistogram histogram
# BUCKETS 10, 30, 60, 300, 600, 1800, 3600
myapp_myhistogram 

```

