# Instagram helper tool

This is just a start of helper tools for instagram client in browser. 

In current state it just marks people from given list in following window.
So if you obtain lost of uses that doesn`t follow you, script marks them for you
and you can unfollow them by regular clicking.

## But why? Why do I not need this, there are other scripts...

This script is "ghots injection" and it behave exactli as human. There is no way
to recognize there is script. Actually "automatic clicing" is not implemented, for now.


# Installation

There are two steps for running script.

1. You must somehow inject contetn of script "ihh.js" into page. Best way to do
is to use some javascript autoload plugin. Or use something like [snippets in Chorome](https://developers.google.com/web/tools/chrome-devtools/javascript/snippets).
2. You must modify converting function to match your input data. 

## The callback in constructor
You see, that in very bottom of script `ihh.j` there
is a creation of new instance and callback as parameter of constructor.
```javascript
var a = new IH((line)=>{
    return line.split(",")[1];
});
```
List of names is included from textarea, and script assume, that one line of it
presents data of one follower. What this function does is to return follower name from
that line. In this very case, the line consist of CSV values and in second column is out
demanded value, so it us pushed to return.

And thats all.

# How to operate?

After running snipped in left top viewport corner will appear little red rectangle:

![x](imgs/button.png)
 
Clicking on `+` button opens textarea where you have to put your list,
 
![x](imgs/textarea.png)
  
Then open your instagram profile and its following tab. Here you can see follower from list
  marked RED
![x](imgs/following.png)
   
Scripts is watching every AJAX response, and if there is reponse 429 it will notify you. It means
that you must wait a little to do the action again. Its little annoying, but you can 
after while continue and reduce large count of followers....

Oh, and script uses localsotrage, so that you do not need to load followers list every time 
you start sctipt (on page reload or tab close).
   