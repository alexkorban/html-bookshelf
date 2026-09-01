# Leave destination URL policy to callers

The package will accept any non-empty URL string and escape it when writing the
HTML attribute, without restricting schemes or validating destinations. This
keeps the renderer usable with custom URL schemes and non-web targets; callers
who render untrusted Book Collections must apply their own URL policy first.
