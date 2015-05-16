/*
 * Copyright (c) 2015 Mountainstorm
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


 +function ($) {
  'use strict'

  // FIENDISH PUBLIC CLASS DEFINITION
  // ================================

  var Fiendish = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.$element   = null

    this.init('fiendish', element, options)
  }

  Fiendish.VERSION  = '1.0.0'

  Fiendish.DEFAULTS = {
    url: null,
    ready: null,
    groups: null
  }

  Fiendish.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)

    this.$page = this.$element.find('.mainFrame > .pusher > .ui')
    this.setup()
    if (options.url) {
      var that = this
      $.get(options.url, null, function(data) {
        that.populateMenu(data)
        that.completeSetup(data)
      }, 'json')
    } else if (this.groups) {
      this.populateMenu(null)
      this.completeSetup(null)
    }
    // otherwise user must call 'complete'
  }

  Fiendish.prototype.getDefaults = function () {
    return Fiendish.DEFAULTS
  }

  Fiendish.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)
    return options
  }

  Fiendish.prototype.setup = function () {
    var options = this.options

    this.$sidebar = this.$element.find('.mainFrame > .sidebar.menu')
    this.setupNavigationBarSearch()
    this.setupMenuFilter()
    this.$element.find('.ui.dropdown').dropdown()
  }

  Fiendish.prototype.populateMenu = function (data) {
    var options = this.options
    var $sidebar = this.$sidebar

    var groups = data.groups
    if (jQuery.type(options.groups) == 'function') {
      groups = options.groups(data)
    } else if (jQuery.type(options.groups) == 'array') {
      if (groups != null) {
        console.log('Warning; semantic.fiendish.js; specified array in groups - yet laoded data; using supplied')
      }
      groups = options.groups
    } 

    $(groups).each(function () {
      var name = this.name
      var url = this.url
      var $group = $('<div class="item"><a href="' + url + '">' + name + '</a></div>')
      var $menu = $('<div class="menu"></div>')
      $(this.items).each(function () {
        var name = this.name
        var url = this.url
        $menu.append('<a href="' + url + '" class="item">' + name + '</a>')       
      })
      $group.append($menu)
      $sidebar.append($group)
    })
  }

  Fiendish.prototype.setupNavigationBarSearch = function () {
    var $element = this.$element
    /* setup search expansion/contraction */
    var $search = $element.find('.navigationBar a.item.input.search')
    var $input = $search.children('input')

    $search.click(function () {
      var $this = $(this)
      if ($input.css('display') == 'none') {
        $search.addClass('active')
        $input.animate({ width: 'show' })
        $input.focus()
        $input.blur(function () {
          // XXX: dont close if search results shown?
          $search.removeClass('active')
          $input.animate({ width: 'hide' })
          $input.val('')
        })
      }
    })
  }

  Fiendish.prototype.setupMenuFilter = function () {
    var $element = this.$element
    var $sidebar = this.$sidebar
    /* setup menu filter */
    var $filter = $element.find('.navigationBar a.item.input.filter')
    var $input = $filter.children('input')
    var $icon = $filter.children('.icon')
    this.$sidebarButton = $filter

    $icon
      .removeClass('bars')
      .addClass('notched circle loading')
      .click(function () {
      // if we click the button - clean the content
      $input.val('')
      $sidebar.find('.item').show()
    })

    $input.keyup(function () {
      var $input = $(this)
      // search - check typed text against names
      // hide all which don't match; except parents of matched
      var $all = $sidebar.find('.item')
      $all.show()
      if ($input.val().length > 0) {
        $all.each(function () {
          var $this = $(this)
          var text = $this.text().toLowerCase()
          if (text.indexOf($input.val().toLowerCase()) == -1) {
            $this.hide()
          }
        })
      }
    })

    /* allow click inside filter is active */
    $input.click(function (e) {
      if ($(this).parent('.active').length) {
        e.stopImmediatePropagation()
      }
    })    
  }

  Fiendish.prototype.setupSidebar = function () {
    /* setup sidebar */
    var $sidebar = this.$sidebar
    var $button = this.$sidebarButton
    var $icon = this.$sidebarButton.children('.icon')

    $sidebar
          .sidebar({
            context: $sidebar.parent(), // VERY important
            onVisible: function () { 
              $button.addClass('active') 
              $icon
                .removeClass('bars')
                .addClass('close')
            },
            onHide: function () { 
              $button.removeClass('active') 
              $icon
                .removeClass('close')
                .addClass('bars')
            }
          })
          .sidebar('setting', 'transition', 'overlay')
          .sidebar('attach events', $button)

    $icon
      .removeClass('notched')
      .removeClass('circle')
      .removeClass('loading')
      .addClass('bars')
  }

  Fiendish.prototype.completeSetup = function (data) {
    var options = this.options
    // setup sidebar and restore icon
    this.setupSidebar()
    if (options.ready) {
      options.ready.call(this, data)
    }
  }

  Fiendish.prototype.complete = function (groups) {
    this.populateMenu({ groups: groups })
    this.completeSetup(null)
  }

  Fiendish.prototype.destroy = function () {
    var that = this
    this.hide(function () {
      that.$element.off('.' + that.type).removeData(that.type)
    })
  }  


  // FIENDISH PLUGIN DEFINITION
  // ==========================

  function Plugin(option, arg1, arg2, arg3) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('fiendish')
      var options = typeof option == 'object' && option

      if (!data && /destroy/.test(option)) return
      if (!data) $this.data('fiendish', (data = new Fiendish(this, options)))
      if (typeof option == 'string') data[option](arg1, arg2, arg3)
    })
  }

  var old = $.fn.fiendish

  $.fn.fiendish             = Plugin
  $.fn.fiendish.Constructor = Fiendish


  // FIENDISH NO CONFLICT
  // ====================

  $.fn.fiendish.noConflict = function () {
    $.fn.fiendish = old
    return this
  }

}(jQuery)
