semantic.fiendish.js
====================

A simple toolbar/sidebar template for semantic-ui.

Have a look at the demo: https://cdn.rawgit.com/mountainstorm/semantic.fiendish.js/master/demo.html


Documentation
-------------

A simple Semantic-UI template with sidebar menu.  You need some HTML very similar to this:
```
<div class="fiendish">

    <!-- topbar menu -->
    <div class="ui navigationBar">
      <div class="computer tablet only">
        <div class="ui inverted menu navbar large">
          <a class="item inverted transparent ui input filter">
            <i class="bars icon"></i>
            <input type="text" placeholder="Go to component...">
          </a>
          <a href="#" class="brand item">
            <i class="lab icon"></i> <!-- site icon -->
            Fiendish <!-- site name -->
          </a>
          <span class="location">
          </span>
          <div class="right menu">
            <a class="item search inverted transparent ui input">
              <i class="search icon"></i>
              <input type="text" style="display: none;" placeholder="Search...">
            </a>
            <div class="ui dropdown item">
              <i class="user icon"></i>
              <i class="dropdown icon"></i>
              <div class="ui menu transition hidden">
                <!-- user dropdown menu -->
                <div class="ui item">
                  <img class="ui avatar" src="Unknown.jpeg">
                  <span class="text">Christian Black</span>
                </div>
                <div class="ui item">
                  <i class="sign out icon"></i>
                  Sign out
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- main content -->
    <div class="ui mainFrame">
      <div class="ui inverted left inline vertical sidebar menu">
        
        <!-- You can specify menu items manually here
        <div class="item">
          <a href="#GroupA">
            Group A
          </a>
          <div class="menu">
            <a href="#GroupA/tem1" class="item">Item 1</a>
            <a href="#GroupA/item2" class="item">Item 2</a>
            <a href="#GroupA/item3" class="item">Item 3</a>
          </div>
        </div>
        -->
        
      </div>
      <div class="pusher">
        <div class="ui basic segment loading">

          <!-- page content goes/is loaded here -->

        </div>
      </div>
    </div>
</div>
```

Options:
* __url__: if present the url to fetch the menu data from; your data needs to have the following format:
```
{
    "groups": [{
        "name": "Group A",
        "url": "#GroupA",
        "items": [{
            "name": "Item 1"
            "url": "#GroupA/Item1"
        }]
    }]
}
```
* __groups__: if present an array of groups (the content of groups - above) or a function which will be called with the data downloaded from __url__ and returns an array of groups to render; this allows you to download custom data and transform the data into the required format.
* __ready__: callback when setup is complete.  Will be asyncronous if loading data from a url


If you decide you dont want the template to load the data (at all) you can leave __url__ and __groups__ empty and the template will just do initial setup (you won't be able to open the sidebar).  

When you do have your data, just call `fiendish('complete', groups)` 


Dependencies
------------

* Semantic-UI

Keywords
--------
jQuery, Semantic-UI


License
-------

Copyright (c) 2015 Mountainstorm
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.