# Test package-private pure functions

The npm package will export only its rendering and mounting interfaces, while
source modules may expose pure functions for direct unit tests. This provides
red/green coverage of validation and visual rules without expanding the public
package interface; internal-test coupling is accepted deliberately.
