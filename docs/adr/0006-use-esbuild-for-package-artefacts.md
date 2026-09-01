# Use esbuild for package artefacts

The JavaScript package will use esbuild as a development-only build tool for
its ESM, browser IIFE, and CSS artefacts. The package does not need an
application development server, so esbuild keeps the distribution path direct
and Ramda remains the only runtime dependency.
