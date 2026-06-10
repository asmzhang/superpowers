'use strict';

/*
 * Minimal non-bypass Android Frida anti-debug probe.
 *
 * Purpose:
 *   Gather evidence before deciding whether anti-debug/anti-Frida blocked analysis.
 *
 * Rules:
 *   - Observe only.
 *   - Do not patch ptrace return values.
 *   - Do not override Debug.isDebuggerConnected().
 *   - Do not hide Frida strings or bypass checks.
 *
 * Gadget example:
 *   frida -H 127.0.0.1:2199 -n Gadget -q -l probe-min.js -o probe-min.log
 */

var TAG = 'anti_debug_probe_min';

function log(msg) {
  console.log('[' + TAG + '][pid=' + Process.id + '] ' + msg);
}

function safe(fn) {
  try {
    return fn();
  } catch (e) {
    return '<err ' + e + '>';
  }
}

log('script loaded process=' + Process.name + ' arch=' + Process.arch + ' frida=' + Frida.version);
log('Java.available=' + Java.available);

try {
  var ptrace = Module.findExportByName(null, 'ptrace');
  if (ptrace) {
    Interceptor.attach(ptrace, {
      onEnter: function (args) {
        this.request = args[0].toInt32();
        this.pid = args[1].toInt32();
      },
      onLeave: function (retval) {
        log('ptrace request=' + this.request + ' pid=' + this.pid + ' ret=' + retval.toInt32());
      }
    });
    log('ptrace observer attached');
  } else {
    log('ptrace export not found');
  }
} catch (e) {
  log('ptrace observer failed: ' + e);
}

function tryJava(reason) {
  if (!Java.available) {
    log('Java unavailable reason=' + reason);
    return;
  }

  Java.perform(function () {
    log('Java.perform ok reason=' + reason);

    var Debug = Java.use('android.os.Debug');
    log('Debug.isDebuggerConnected=' + Debug.isDebuggerConnected());
    log('Debug.waitingForDebugger=' + Debug.waitingForDebugger());

    var ActivityThread = Java.use('android.app.ActivityThread');
    var app = ActivityThread.currentApplication();
    if (app) {
      log('currentApplication=' + app.getClass().getName() + ' package=' + app.getPackageName());
    } else {
      log('currentApplication=null');
    }
  });
}

tryJava('initial');

setTimeout(function () {
  tryJava('delay-1000ms');
}, 1000);

setTimeout(function () {
  tryJava('delay-3000ms');
}, 3000);

setInterval(function () {
  log('heartbeat Java.available=' + Java.available + ' thread=' + safe(function () { return Process.getCurrentThreadId(); }));
}, 5000);
