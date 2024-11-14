import sanitizeHtml from 'sanitize-html';

const sanitizer = (input:string) => sanitizeHtml(input, {
    allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
    allowedAttributes: {
      'a': [ 'href' ]
    },
    allowedIframeHostnames: ['www.youtube.com']
});
//function to make links into anchor tags

const linkify = (input:string) => input.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');

export default (input:string) => sanitizer(linkify(input));
