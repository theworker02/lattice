# LatticeLight and Bridge

Status: **SIMULATED** codec and diagnostic loopback; physical communication **CONCEPT**.

LatticeLight supplements wired LatticeLink. Version-1 experimental frame: `A5` preamble, `01` version, one-byte payload length, 1–64 UTF-8 payload bytes, CRC-8 (polynomial 0x07, initial 0, no reflection, no final XOR) over payload. Each bit is Manchester encoded as 0→01, 1→10. The decoder validates framing, symbol pairs, length, CRC and UTF-8. It rejects an explicitly obstructed or misaligned path. The framing is for diagnostics, not authenticated actuator control.

Physical emitter power, carrier, symbol rate, receiver bandwidth, sunlight rejection, range and eye-safety assessment remain unresolved. The simulator has no analog link budget, clock recovery, ambient-light saturation or packet collision model. [Vishay receiver documentation](https://www.vishay.com/en/product/82836/) describes optical-noise mitigation in real receiver families; it is not evidence for our unbuilt link.

The Bridge adapter accepts `{version:"0.5.0", operation:"diagnostic", payload:"..."}` with a bounded text payload and returns an explicitly virtual loopback receipt. Other operations are rejected. There are no open ports, HTTP callbacks, credentials or hidden network requests. Planned specialized adapters include GPIO/I²C/SPI/UART, CAN/USB, and Ethernet/Wi-Fi/Bluetooth/MQTT. Do not expose all interfaces on every module.

Software-defined clock is represented by simulation time. Sun position is an explicit virtual environment input, not an astronomical ephemeris. Weather, forecast, computer-state, HTTP/webhooks and MQTT remain adapter proposals. They must provide schema validation, freshness, permission boundaries, deterministic offline behavior and no ability to override local protection.
