const express = require('express');
const client = require('prom-client')
const app = express();

const register = new client.Registry()

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  registers: [register],
  labelNames: ['method', 'path', 'status'],
})

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  registers: [register],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
})


const counterMiddleware = () => {
  return (req, res, next) => {
    requestCounter.labels(req.method, req.path, res.statusCode.toString()).inc()
    next()
  }
}

const delay = () => Math.floor(Math.random() * 2000) 

const delayMiddleware = () => { 
  
  return async (_,__,next) => {
    const delaySeconds = delay()
    console.log(delaySeconds)
    await new Promise(res => setTimeout(res, delaySeconds))
    next()
  }
}

const responseTimeMiddleware = (req, res, time) => {
    if (req?.route?.path) {
      httpRequestDurationSeconds.observe(
        {
          method: req.method,
          route: req.route.path,
          code: res.statusCode,
        },
        time / 1000
      );
    }
}


const startMetricsServer = () => {

    register.setDefaultLabels({
      app: 'node-app'
    })
    
    client.collectDefaultMetrics({ register })
  
    app.get("/metrics", async (req, res) => {
      res.set("Content-Type", client.register.contentType);
  
      return res.send(await register.metrics());
    });
  
    app.listen(9100, () => {
      console.log("Metrics server started at http://localhost:9100");
    });
    
}

module.exports = {startMetricsServer, counterMiddleware, responseTimeMiddleware, delayMiddleware}