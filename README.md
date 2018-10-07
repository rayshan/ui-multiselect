ui-multiselect
==============

A token field, AKA an inline multiselect with typeahead, built as an AngularJS directive.

[Demo](https://shan.io/ui-multiselect/)

For thinking behind this component library, and a general tear down of token fields, see this [blog post](https://shan.io/writing/how-token-fields-or-inline-multiselect-components-work-in-web-apps/).

How to Use
----------

Include:

*	ui-multiselect.html
* ui-multiselect.js
* ui-multiselect.css (edit for your own styling)

Dependencies
------------

Aim is no dependency besides AngularJS.

Unfortunately `angular-ui`'s `ui-utils` is needed, specifically `ui-event,` to bind focus & blur of input. See [this AngularJS issue](https://github.com/angular/angular.js/issues/1277).

License
-------

MIT

---

`< >` with ❤ by [Ray Shan](http://shan.io)
