---
title: (De)websockify SSH to avoid lockdown in hotel rooms
author: Damian Kaczmarek (Rush)
role: Co-founder, C++ & Node.js Developer
email: rush@virtkick.io
---


At [VirtKick](https://www.virtkick.io/) we are using [http-master](https://github.com/CodeCharmLtd/http-master/) to proxy VNC over web sockets
but it can be used also in much more interesting ways. Consider this config loaded by http-master:


```yaml
# config.yaml

ports:
  80:
    router:
      "*": "redirect -> https://[1]/[path]"
  443:
    router:
        "myserver.com/services/ssh": "websockify -> 22" # THIS!
        "*": 8080
    ssl:
      primaryDomain: "mywebsite.net"
      certDir: "/etc/http-master/certs"
```

I won't dwelve on specific config entries, but let's stop at the "websockify" one.
The way it works in this setup is that whenever anyone creates a web socket, let's say in JavaScript...

```javascript
var ws = new WebSocket("wss://myserver.com/services/ssh");
```
... this opens a connection from http-master to SSH over TCP port 22.
From this moment all the data events flying both ways will map to TCP reads and writes and essentially the WebSocket
can be treated like a TCP socket. One day some brave soul will compile **openssh-client** in Emscripten and it will
just work from the browser. However there is other way to use this.

## Meet dewebsockify

Make sure you have node.js installed, and install:

```
npm install -g dewebsockify
```

It basically works on same principle as the sockify function in http-master but the reverse way, so...

```
dewebsockify "wss://myserver.com/services/ssh" 2222
```

This creates a local 2222 TCP socket which maps to the remote 22 TCP socket.
Essentially it is an equivalent of ...

```
ssh myserver.com -L 2222:localhost:22
```

... but it's all sent over HTTPS and what's most important **it doesn't disturb the normal operation of the server**.

Let's connect to our ssh ...

```
$ ssh localhost -p 2222
rush@myserver~>
```

With http-master on your server and as long as you have HTTP or HTTPS, you can always stay connected.

## Setting up universal SSH gateway

Instead of having config entry

```
 "myserver.com/services/ssh" : "websockify -> 22"
```

change it to

```
"myserver.com/ssh/*/*" : "websockify -> [1]:[2]"
```

Now whenever you do:

```
dewebsockify "wss://myserver.com/ssh/somehost/someport" 2222
```

It will hook up any remote TCP port, not only SSH to a local one. You can read up on http-master's docs how to add authentication to any route, including web sockets.

We will follow up in a later blog post how exactly do we use http-master. Stay tuned.
