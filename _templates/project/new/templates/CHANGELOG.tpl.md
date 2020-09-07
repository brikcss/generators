---
to: "<%= locals.features.release ? locals.dest + 'CHANGELOG.tpl.md' : null %>"
---
# Change log

Notable changes will be documented here.

{{#each releases}}
    ##{{#unless major}}#{{/unless}} {{#if href}}[{{title}}]({{href}}){{else}}{{title}}{{/if}}

    {{#commit-list commits heading='## Breaking changes' subject='breaking'}}
        - {{subject}} [`{{shorthash}}`]({{href}})
    {{/commit-list}}

    {{#commit-list commits heading='## New features' subject='new|feature'}}
        - {{subject}} [`{{shorthash}}`]({{href}})
    {{/commit-list}}

    {{#commit-list commits heading='## Changed features' subject='change|deprecate|remove'}}
        - {{subject}} [`{{shorthash}}`]({{href}})
    {{/commit-list}}

    {{#commit-list commits heading='## Fixes' subject='fix'}}
        - {{subject}} [`{{shorthash}}`]({{href}})
    {{/commit-list}}

    {{#commit-list commits heading='## Documentation' subject='docs'}}
        - {{subject}} [`{{shorthash}}`]({{href}})
    {{/commit-list}}

    {{#commit-list commits heading='## Other' subject='debt|performance|security|test|tools'}}
        - {{subject}} [`{{shorthash}}`]({{href}})
    {{/commit-list}}
{{/each}}
