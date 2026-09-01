# Code style 

- Use UK English spelling except for "color" and "program". 
- Use Ramda whenever it supplies the needed collection, object, string, or
  composition operation; do not replace it with native equivalents.
- Use `Ramda.map` or `Ramda.forEach` instead of loops. 
- Use `import * as R from "ramda"` rather than importing individual functions.
- Use only plain data objects and arrays for package data.
- Do not write classes or use inheritance.
- Do not mutate inputs or retain hidden rendering state.
- Name pure functions with a noun or noun phrase. `bookshelfFragment` is the
  public example.
- Name functions with side effects using a verb or verb phrase.
  `mountBookshelf` and CLI file-writing functions are examples.
- Keep browser DOM work and command-line I/O at thin outer adapters around the
  pure rendering core.
