var puppeteer = require('puppeteer')
var http = require('http')
var fs = require('fs')
var path = require('path')

var PORT = 5051

var server = http.createServer(function(req, res) {
    var filePath = path.join(__dirname, '..', req.url === '/' ? '/test/test.mock.html' : req.url)
    var ext = path.extname(filePath)
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.png': 'image/png'
    }
    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.writeHead(404)
            res.end('Not found')
        } else {
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' })
            res.end(data)
        }
    })
})

server.listen(PORT, async function() {
    console.log('Server listening on port ' + PORT)
    try {
        var browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
        var page = await browser.newPage()
        
        page.on('pageerror', function(err) {
            console.log('PAGE ERROR:', err.message)
        })
        page.on('console', function(msg) {
            if (msg.type() === 'error') {
                console.log('CONSOLE ERROR:', msg.text())
            }
        })
        
        await page.goto('http://localhost:' + PORT + '/test/test.mock.html', { waitUntil: 'networkidle0', timeout: 30000 })
        
        // Wait for mocha to finish
        var result = await page.evaluate(function() {
            return new Promise(function(resolve) {
                var check = function() {
                    var mochaElement = document.querySelector('#mocha')
                    if (mochaElement && mochaElement.querySelector('.test.fail')) {
                        var failures = mochaElement.querySelectorAll('.test.fail').length
                        var passes = mochaElement.querySelectorAll('.test.pass').length
                        var total = mochaElement.querySelectorAll('.test').length
                        resolve({ total: total, passes: passes, failures: failures, done: true })
                    } else if (mochaElement && mochaElement.querySelector('.test.pass')) {
                        // Check if there are any failures or the stats show done
                        var stats = mochaElement.querySelector('.suite')
                        var passes = mochaElement.querySelectorAll('.test.pass').length
                        var total = mochaElement.querySelectorAll('.test').length
                        resolve({ total: total, passes: passes, failures: 0, done: true })
                    } else {
                        setTimeout(check, 500)
                    }
                }
                setTimeout(check, 1000)
            })
        })
        
        console.log('Test results:', JSON.stringify(result))
        
        if (result.failures > 0) {
            console.log('FAILURES DETECTED')
            var failures = await page.evaluate(function() {
                var items = []
                document.querySelectorAll('.test.fail h2').forEach(function(el) {
                    items.push(el.textContent)
                })
                return items
            })
            console.log('Failed tests:', failures)
        }
        
        await browser.close()
        server.close()
        process.exit(result.failures > 0 ? 1 : 0)
    } catch (e) {
        console.error('Error:', e)
        server.close()
        process.exit(1)
    }
})
