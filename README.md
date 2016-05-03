# NodeJS Prometheus Wrapper
Wrapper to official NodeJS Prometheus exporter ([prom-client](https://github.com/siimon/prom-client))

## WHY

The official NodeJS client for prometheus requires to transporter the metrics variables in your code (counters, gauges, histograms and summaries).

This small library allow to control variables from the whole code, in a singleton, by getting the metric by name, just like that: ```require('prometheus-wrapper').get("<counter-name>").inc()```

## EXAMPLES

Execute this command to launch an express server exposing some metrics.
Browse **localhost:8080/metrics** to monitor the metrics (data is changing after 10s).

```sh
$ node examples/index.js
```

See the source files in **/examples** to see suggestions of implementation.

## HOW TO

init.js

```javascript
var prometheus		= require("prometheus-wrapper");

var express			= require('express');
var app				= express();

prometheus.init("myapp", app);		// if app is not defined, then prometheus wrapper create an http server on port 9000

// Counter
prometheus.createCounter("mycounter", "A number we occasionally increment.");

// Gauge
prometheus.createGauge("mygauge", "A random number we occasionally set.");

// Histogram
prometheus.createHistogram("myhistogram", "A chat duration histogram.", {
	buckets: [ 10, 30, 60, 300, 600, 1800, 3600 ]
});

// Summary
prometheus.createSummary("mysummary", "Compute quantiles and median of a random list of numbers.", {
	percentiles: [ 0.01, 0.1, 0.5, 0.9, 0.99 ]
});

app.listen(8080);
```

wherever-in-your-code.js

```javascript
var prometheus		= require("prometheus-wrapper");

setInterval(function () {
	prometheus.get("mycounter").inc(42);
}, 10000);

prometheus.get("mygauge").set(42);

var end = prometheus.get("myhistogram").startTimer();
setTimeout(function () {
	end();
}, 15000);

for (var i = 0; i < 100000; ++i) {
	prometheus.get("mysummary").observe(Math.random());
}
```

Exposed ```/metrics``` :

```sh
$ curl 127.0.0.1:8080

# HELP myapp_ mycounter A number we occasionally increment.
# TYPE myapp_ mycounter counter
myapp_ mycounter 84

# HELP myapp_mygauge A random number we occasionally set.
# TYPE myapp_mygauge gauge
myapp_mygauge 42

# HELP examples_myhistogram A chat duration histogram.
# TYPE examples_myhistogram histogram
myapp_myhistogram_bucket{le="10"} 0
myapp_myhistogram_bucket{le="30"} 1
myapp_myhistogram_bucket{le="60"} 1
myapp_myhistogram_bucket{le="300"} 1
myapp_myhistogram_bucket{le="600"} 1
myapp_myhistogram_bucket{le="1800"} 1
myapp_myhistogram_bucket{le="3600"} 1
myapp_myhistogram_bucket{le="+Inf"} 1
myapp_myhistogram_sum 15.002
myapp_myhistogram_count 1

# HELP myapp_mysummary Compute quantiles and median of a random list of numbers.
# TYPE myapp_mysummary summary
myapp_mysummary{quantile="0.01"} 0.009997170550270069
myapp_mysummary{quantile="0.1"} 0.09957970759409267
myapp_mysummary{quantile="0.5"} 0.5016970195079504
myapp_mysummary{quantile="0.9"} 0.8993228241841542
myapp_mysummary{quantile="0.99"} 0.9901868947762174
myapp_mysummary_sum 4999.807495853165
myapp_mysummary_count 10000

```

## Full list of metrics types

[Official documentation](https://prometheus.io/docs/concepts/metric_types/)

### Counter
```
A counter is a cumulative metric that represents a single numerical value that only ever goes up. A counter is typically used to count requests served, tasks completed, errors occurred, etc. Counters should not be used to expose current counts of items whose number can also go down, e.g. the number of currently running goroutines. Use gauges for this use case.
```

### Gauge
```
A gauge is a metric that represents a single numerical value that can arbitrarily go up and down.

Gauges are typically used for measured values like temperatures or current memory usage, but also "counts" that can go up and down, like the number of running goroutines.
```

### Histogram

```
A histogram samples observations (usually things like request durations or response sizes) and counts them in configurable buckets. It also provides a sum of all observed values.

A histogram with a base metric name of <basename> exposes multiple time series during a scrape:

- cumulative counters for the observation buckets, exposed as <basename>_bucket{le="<upper inclusive bound>"}
- the total sum of all observed values, exposed as <basename>_sum
- the count of events that have been observed, exposed as <basename>_count (identical to <basename>_bucket{le="+Inf"} above)
```

### Summary

```
Similar to a histogram, a summary samples observations (usually things like request durations and response sizes). While it also provides a total count of observations and a sum of all observed values, it calculates configurable quantiles over a sliding time window.

A summary with a base metric name of <basename> exposes multiple time series during a scrape:

- streaming φ-quantiles (0 ≤ φ ≤ 1) of observed events, exposed as <basename>{quantile="<φ>"}
- the total sum of all observed values, exposed as <basename>_sum
- the count of events that have been observed, exposed as <basename>_count
```


## Methods available

### Init

- ```client.init(<namespace>, <express-app>)``` => use your own http server

### Counter

- ```client.createCounter(<name>, <help>)```
- ```client.get(<name>).get()```
- ```client.get(<name>).inc()```
- ```client.get(<name>).inc(<delta>)```

### Gauge

- ```client.createGauge(<name>, <help>)```
- ```client.get(<name>).get()```
- ```client.get(<name>).set(<value>)```
- ```client.get(<name>).setToCurrentTime()``` => expose a timestamp in ms
- ```var end = client.get(<name>).startTimer()``` => call ```end()``` to stop the timer, expose a timestamp in seconds

### Histogram
- ```client.createHistogram(<name>, <help>, buckets: [ <categories> ])```
- ```client.get(<name>).get()```
- ```client.get(<name>).observe(<value>)```
- ```client.get(<name>).reset()```
- ```var end = client.get(<name>).startTimer()``` => call ```end()``` to stop the timer, expose a timestamp in seconds

### Summary
- ```client.createSummary(<name>, <help>, buckets: [ <categories> ])```
- ```client.get(<name>).get()```
- ```client.get(<name>).observe(<value>)```
- ```client.get(<name>).reset()```
- ```var end = client.get(<name>).startTimer()``` => call ```end()``` to stop the timer, expose a timestamp in seconds
