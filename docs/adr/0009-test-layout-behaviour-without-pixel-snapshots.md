# Test layout behaviour without pixel snapshots

The test suite will not compare screenshots because installed system fonts and
text rasterisation vary across environments. Browser tests will assert rendered
structure, layout mode, dimensions, and bounded transforms instead; the
framework-free examples page provides manual visual review.
