# Keep rendering functional and isolate I/O

The renderer will be a pure, Ramda-based JavaScript core that accepts plain data
and returns plain data or a Render Fragment. Browser mounting and command-line
input and output are thin side-effecting adapters, so static and dynamic use
share one deterministic implementation and can be tested through public seams.
