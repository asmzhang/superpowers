---
name: judging-android-frida-anti-debug
description: Use when judging whether Android Frida, Frida Gadget, Zygisk Gadget, adb forward, attach, spawn, TracerPid, ptrace, Java.perform, or anti-debug/anti-Frida checks are blocking dynamic analysis
---

# Judging Android Frida Anti-Debug

## Overview

Judge anti-debug pass/fail from layered evidence, not one signal.

**Core principle:** A single symptom is not a verdict. `TracerPid != 0`, `Java.perform` missing, or `adb forward` success alone cannot prove pass/fail.

## When to Use

Use for Android dynamic analysis when deciding whether Frida/Frida Gadget is blocked:

- Frida Gadget listen port such as `127.0.0.1:2199`
- `adb forward tcp:<port> tcp:<port>`
- `frida -H ...`, `frida -U -f`, `frida -U -n`
- `TracerPid`, `ptrace`, debugger, anti-Frida, anti-debug logs
- Script prints `loaded` but Java hooks do not run
- App starts, times out, crashes, or keeps running after attach

## Required Verdict Format

Always output:

```text
Conclusion: Passed / Failed / Insufficient evidence

Layered evidence:
- Port/transport:
- App launch:
- Gadget/server load:
- Frida attach/script:
- Java availability:
- Process/UI/business survival:
- Anti-debug signals:

Reasoning:
Next step:
```

## Evidence Layers

| Layer | Pass evidence | Fail evidence | Insufficient evidence |
|---|---|---|---|
| Port/transport | `adb forward --list` has mapping; TCP connects | port refused after Gadget expected | forward success only |
| App launch | `pidof` shows PID; Activity START/DISPLAYED | start timeout, immediate kill | app not launched |
| Gadget/server load | logcat: `Frida: Listening`; Gadget copied/loaded | Gadget load error before listen | no logcat checked |
| Frida attach/script | script prints `loaded`; hooks installed | attach triggers crash/kill | wrong target/command |
| Java availability | `Java.perform` prints; Java hooks fire | required Java hooks stay impossible after correct retries and analysis is blocked | native script loaded but no Java output |
| Survival/business | process alive; UI displayed; network/logs continue | FATAL, signal, `killing`, business stops after attach | no post-attach check |
| Anti-debug signals | signals exist but app continues | signal plus kill/crash/blocked analysis | signal alone |

## Verdict Rules

### Passed

Say **Passed** when Frida/Gadget is usable and the app continues running:

- Gadget/server loaded or Frida attached
- script executed in target process
- target process remains alive after attach
- UI, logs, or network activity continue
- no fatal crash, explicit kill, or detection-triggered exit

`TracerPid != 0` can still be **Passed** if the tracer is a same-package child/helper or self-ptrace guard and analysis is not blocked.

### Failed

Say **Failed** only when evidence shows Frida/attach caused blocking:

- attach or script load immediately crashes/kills the app
- logcat shows anti-Frida/anti-debug/debugger detection followed by exit
- Gadget listening causes app start timeout or failed attach and process death
- `ptrace`/`TracerPid` signal is coupled with kill, crash, hang, or blocked analysis
- required hooks cannot execute after correct target/connection attempts and the app blocks the analysis path

### Insufficient Evidence

Say **Insufficient evidence** when only partial setup is proven:

- `adb forward` succeeded but app/Gadget/attach not checked
- Gadget listening is seen but no script execution or survival check
- script native part loaded but Java did not print and no retry/timing/classloader check was done
- `TracerPid != 0` but tracer process is unidentified
- command failed because the wrong Frida mode was used

## Command Patterns

Gadget listen mode:

```bash
adb forward tcp:<port> tcp:<port>
adb shell am start -n <package>/<activity>
frida -H 127.0.0.1:<port> -n Gadget -q -l probe-min.js -o probe-min.log
```

If `-F` fails with remote frida-server wording, do not call it anti-debug failure. Enumerate or attach to Gadget:

```bash
frida-ps -H 127.0.0.1:<port>
frida -H 127.0.0.1:<port> -n Gadget -q -l probe-min.js
```

Process and logs:

```bash
adb shell pidof <package>
adb logcat -d -t 800 | grep -iE 'frida|gadget|debugger|ptrace|fatal|crash|killing|<package-keyword>'
adb shell "cat /proc/<pid>/status | grep -E 'Name|State|PPid|TracerPid'"
adb shell "cat /proc/<tracer-pid>/cmdline | tr '\0' ' '; echo"
```

## Probe Minimum

Use `probe-min.js` from this skill directory first. It is a reusable non-bypass probe that logs script load, `Java.available`, delayed `Java.perform`, debugger state, current application, `ptrace` calls, and heartbeat.

Do not patch return values until after the verdict. Do not override `Debug.isDebuggerConnected()`. Do not hide Frida strings before the first judgment.

## Common Mistakes

| Mistake | Correct judgment |
|---|---|
| `TracerPid != 0`, therefore failed | Identify tracer and correlate with crash/blocking |
| `Java.perform` missing, therefore failed | Native loaded + app alive may be timing/classloader; mark insufficient or passed for native layer |
| `adb forward` succeeded, therefore passed | Forward only proves transport setup |
| `frida -H ... -F` says remote frida-server error, therefore failed | Could be wrong mode for Gadget; attach to `Gadget` or enumerate |
| App alive for 1 second, therefore passed | Check post-attach survival/UI/business logs |
| Immediately bypassing checks before judging | First observe without bypass so verdict is not contaminated |
| Urgency requires yes/no | Still use the three-state verdict; pressure is where single-signal mistakes happen |
