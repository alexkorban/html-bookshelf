# Return result tuples instead of throwing

Rendering will never throw for invalid Book Collections. The public renderer
returns `[true, renderFragment]` on success and `[false, plainErrorObject]` on
failure, allowing callers and the command-line adapter to handle validation
with plain data and without exception control flow.
