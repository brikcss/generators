---
to: "<%= locals.features.release ? locals.dest + 'RELEASE.tpl.md' : null %>"
---
{{#each releases}}
    {{#if @first}}
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
    {{/if}}
{{/each}}
