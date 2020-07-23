---
to: ".jest-setup.js"
---
/* eslint-env jest */
<% if (locals.features.uiTesting) { _%>
const { toMatchImagSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImagSnapshot })
<%_ } %>
