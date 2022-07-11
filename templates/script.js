document.addEventListener("DOMContentLoaded", function() {
    const corners     = ['tl', 'tr', 'bl', 'br'];
    const overlay     = document.getElementById('overlay');
    const controls    = document.getElementById('controls');
    const games       = document.getElementById('games');
    const gameList    = games.children;
    const gameSearch  = document.getElementById('search');
    const gameSize    = document.getElementById('width');
    const gameSpacing = document.getElementById('spacing');

    var X = 0,                          // Last known horizontal position
        Y = 0,                          // Last known vertical position
        bCursorShow = true,             // Should the cursor be shown again?
        lastElement = {'id': null};     // Last element with an active tooltip

    /* Python equivalent of string formatting */
    String.prototype.format = function() {
        var args = arguments;
        this.unkeyed_index = 0;
        return this.replace(/\{(\w*)\}/g, function(match, key) { 
            if (key === '') {
            key = this.unkeyed_index;
            this.unkeyed_index++
            }
            if (key == +key) {
                return args[key] !== 'undefined' ? args[key] : match;
            } else {
                for (var i = 0; i < args.length; i++) {
                    if (typeof args[i] === 'object' && typeof args[i][key] !== 'undefined') {
                        return args[i][key];
                    }
                }
                return match;
            }
        }.bind(this));
    };

    window.mobileAndTabletCheck = function () {
        let check = false;
        (function (a) {
          if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
              a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
              a.substr(0, 4)
            )
          )
            check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      };
      console.log(window.mobileAndTabletCheck)
    if (window.mobileAndTabletCheck){
        controls.classList.toggle('visible');
    }

    function updateTooltipPos(x, y) {
        if (updateTooltipPos.tooltip) {
            const t = updateTooltipPos.tooltip;
            const w = document.documentElement.clientWidth || document.body.clientWidth;
            const h = document.documentElement.clientHeight || document.body.clientHeight;

            // Anchor the tooltip to the right/bottom if the standard orientation overflows
            // the view, and there's enough space to fit it in the other direction.
            const bRight = (w < (x + t.offsetWidth)) && (0 <= (x - t.offsetWidth));
            const bBottom = (h < (y + t.offsetHeight)) && (0 <= (y - t.offsetHeight));
            const pos = bRight + 2 * bBottom;  // Boolean to bit scalar
            var newX = x - (bRight ? t.offsetWidth : 0);
            var newY = y - (bBottom ? t.offsetHeight : 0);
            Object.assign(t.style, {left: newX + 'px', top: newY + 'px'});

            for (var i = 0; i < 4; i++) {
                t.classList[i == pos ? 'add' : 'remove'](corners[i]);
            }
        }
    }

    // Return the child element that acts as a tooltip
    function getTooltip(element) {
        for (const child of element.children)
            if (child.classList.contains("data"))
                return child;
        return null;
    }

    /* Set the `min-width` equal to the current width 

       We use `display: none` instead of hiding in order to save
       a lot of time on loading. In order to have both the minimum
       necessary blank space and tooltips not resizing along the edges
       of the screen, we temporarily display & hide to calculate the
       necessary width, before resetting both */
    function initTooltip(element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        element.style.minWidth = element.offsetWidth + 'px';
        element.style.display = null;
        element.style.visibility = null;
    }

    // Wrapper for the continuous update of the range input controls
    function hookRangeChange(r,f) {
        var n,c,m;
        r.addEventListener("input",function(e){n=1;c=e.target.value;if(c!=m)f(e);m=c;});
        r.addEventListener("change",function(e){if(!n)f(e);});
    }

    // Update the game card width
    function onChangeSize(event) {
        games.style.setProperty('--cover-width', event.target.value + 'px');
    }

    // Update the game cards spacing
    function onChangeSpacing(event) {
        games.style.setProperty('--cover-spacing', event.target.value + 'px');
    }

    // Show/hide the input controls
    function onToggleControls(event) {
        if (event.ctrlKey) {
            if (32 == event.keyCode) {
                controls.classList.toggle('visible');  // Ctrl+Space
            } else if (70 == event.keyCode) {
                controls.classList.add('visible');  // Ctrl+F
            }

            // Focus on the search bar, if visible
            if (controls.classList.contains('visible'))
                gameSearch.focus();
        }
    }

    // Triggers `onSearch` to clear the search results
    function onSearchCancel(event) {
        setTimeout(onSearch, 10, event);
    }

    // Perform search on the games
    function onSearch(event) {
        var query = event.target.value.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
        if (query == onSearch.lastQuery)
            return;
        onSearch.lastQuery = query;
        const bCancelSearch = 0 == query.length;
        games.classList.toggle('search-results', !bCancelSearch);

        if (bCancelSearch) {
            // Reset search results
            for (const o of onSearch.results) {
                gameList[o].classList.remove('hit');
                gameList[o].style.order = null;
            }
            onSearch.results = []
        } else {
            // Build a list of results
            const filteredQuery = query.replace(/\s+/, '.*?');
            var results = [];
            for (var i = 0; i < gameList.length; i++) {
                const searchData = JSON.parse(gameList[i].dataset.search);
                for (const source of searchData) {
                    if (-1 !== source.search(filteredQuery)) {
                        results.push(i);
                        break;
                    }
                }
            }
            // In with the new…
            for (const n of results) {
                if (!onSearch.results.includes(n)) {
                    gameList[n].classList.add('hit');
                    //gameList[o].style.order = /* for future weighted searches */
                }
            }
            // … out with the old
            for (const o of onSearch.results) {
                if (!results.includes(o)) {
                    gameList[o].classList.remove('hit');
                    gameList[o].style.order = null;
                }
            }
            onSearch.results = results;
        }
    }
    onSearch.results = [];  // Init static variable

    // Raycasting for easier tooltip management
    function onMouseEvent(event) {
        // Update coordinates on `mousemove` events
        if ('mousemove' === event.type) {
            X = event.offsetX;
            Y = event.offsetY;
        }

        // Based on current mouse coordinates find the relative game card
        var element = {'id': null};
        if ('mouseout' !== event.type) {
            const elements = document.elementsFromPoint(X, Y);
            // .overlay #game-ID html
            if (3 == elements.length)
                element = elements[1];
        }

        if (element.id == lastElement.id) {
            // We're on the same card as before, update the tooltip position only
            if (element.id)
                updateTooltipPos(X, Y);
        } else {
            // We're not on the same card as before, hide previous card's tooltip
            if (lastElement.id) {
                lastElement.classList.remove('hover');
                setTimeout(function(){
                    if (bCursorShow)
                        overlay.style.cursor = 'initial';
                }, 100);
                bCursorShow = true;
                updateTooltipPos.tooltip = null;
            }

            // If we're on a game card, show its tooltip
            if (element.id) {
                const t = getTooltip(element);
                updateTooltipPos.tooltip = t;
                if ('' === t.style.visibility)
                    initTooltip(t);
                t.style.visibility = 'hidden';
                updateTooltipPos(X, Y);
                bCursorShow = false;
                overlay.style.cursor = 'none';
                element.classList.add('hover');
                // Delay the visualisation to remove glitches
                setTimeout(function(e) {e.style.visibility = 'visible';}, 1, t);
            }

            lastElement = element;
        }
    }

    // Setup the handlers
    overlay.addEventListener('mousemove', onMouseEvent);
    overlay.addEventListener('mouseout', onMouseEvent);
    window.addEventListener('scroll', onMouseEvent);
    document.addEventListener('keyup', onToggleControls);
    hookRangeChange(gameSize, onChangeSize);
    hookRangeChange(gameSpacing, onChangeSpacing);
    gameSearch.addEventListener('blur', onSearchCancel);
    gameSearch.addEventListener('input', onSearch);

    // Replace the SVG icon placeholders in reverse order to avoid position inconsistencies and skipped icons
    (function replaceSVGplaceholders() {
        p = {}  // cache
        // class="pi pi-[platformName]"
        const icons = document.getElementsByClassName('pi');
        for (var i = icons.length-1; 0 <= i; i--) {
            const platform = icons[i].classList[1].substr(3);
            const platforms = Array.from(icons[i].classList).slice(1).join(' ');
            try {
                if (!p.hasOwnProperty(platform)) {
                    // Maintain the symbols' view box and aspect ratios
                    const symbol = document.getElementById('icon-platform-' + platform);
                    p[platform] = '<svg class="platforms {1}" preserveAspectRatio="{2}" viewBox="{3}"><use xlink:href="#icon-platform-{0}" /></svg>'.format(
                        platform,
                        platforms,
                        symbol.getAttribute('preserveAspectRatio'),
                        symbol.getAttribute('viewBox'),
                    );
                }
                icons[i].outerHTML = p[platform];
            } catch(e) {}
        }
    })();

    // Load finished, animate the game list in
    overlay.style.opacity = 0;
    overlay.style.cursor = 'initial';
});
