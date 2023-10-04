var ScaffoldClient = (function (m, $) {

    m.modules = [{{{modules_list}}}];

	m.oninitset = false;
    m.onloadset = false;

    m.loadcheck = false;
    m.loadcount = 0;

    m.options = {
        source: 'api',
        origin: document.location.origin,{{{after_init}}}{{{after_onload}}}
        css:{{{css_files}}},
        js:{{{js_files}}}
    };

    m.data = {};

    m.init = function(options) {
        if (ScaffoldClient.oninitset) return false;
        ScaffoldClient.options = $.extend(ScaffoldClient.options, options );
        if (ScaffoldClient.options.css !== undefined) {
            if (typeof ScaffoldClient.options.css === 'string')
                ScaffoldClient.options.css = [ScaffoldClient.options.css];
            ScaffoldClient.options.css.forEach((a) => {
                var fileref=document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", a)
                document.getElementsByTagName("head")[0].appendChild(fileref)
            });
        }

        if (ScaffoldClient.options.js !== undefined) {
            if (typeof ScaffoldClient.options.js === 'string')
                ScaffoldClient.options.js = [ScaffoldClient.options.js];
                
            ScaffoldClient.options.js.forEach((a) => {
                var st   = document.createElement("script");
                st.type  = "text/javascript";
                st.src   = a;
                document.getElementsByTagName('head')[0].appendChild(st);
            });
        }

        if (ScaffoldClient.modules.length) {
            ScaffoldClient.modules.forEach(item => {
                if (item.init !== undefined && typeof item.init === 'function')
                    item.init();
            });
        }

        if (ScaffoldClient.options.afterInit !== undefined && typeof ScaffoldClient.options.afterInit === 'function')
            ScaffoldClient.options.afterInit();

        ScaffoldClient.oninitset = true;

    };

    m.onPageLoad = function() {
        if (!ScaffoldClient.oninitset || ScaffoldClient.onloadset) {
			if (!ScaffoldClient.loadcheck) {
				ScaffoldClient.loadcheck = setInterval(function() {
					if (document.readyState === 'complete') {
						ScaffoldClient.onPageLoad();
					}
				}, 250);
			}
			
			if (200 == ScaffoldClient.loadcount) {
				clearInterval(ScaffoldClient.loadcheck);
			} else {
				ScaffoldClient.loadcount += 1;
			}
			return;
		}

		if (ScaffoldClient.loadcheck)
			clearInterval(ScaffoldClient.loadcheck);
		
        ScaffoldClient.loadcount = 0;

        if (ScaffoldClient.modules.length) {
            ScaffoldClient.modules.forEach(item => {
                if (item.pageload !== undefined && typeof item.pageload === 'function')
                    item.pageload();
            });
        }

        if (ScaffoldClient.options.afterOnLoad !== undefined && typeof ScaffoldClient.options.afterOnLoad === 'function')
            ScaffoldClient.options.afterOnLoad();
        
        ScaffoldClient.onloadset = true;
    };

    m.getCourseID = function() {
        if (ScaffoldClient.options['courseid'] === undefined) {
            if (window?.ENV?.COURSE_ID) {
                ScaffoldClient.options['courseid'] = window.ENV.COURSE_ID;
            } else {
                if (document.getElementById('cbt-courseid')) {
                    ScaffoldClient.options['courseid'] = document.getElementById('cbt-courseid').getAttribute('data-course-id');
                } else if (document.getElementById('cbt-progress')) {
                    ScaffoldClient.options['courseid'] = document.getElementById('cbt-progress').getAttribute('data-course-id');
                } else if(window.location.pathname.match(/(courses)\/[0-9]{1,}/gi)) {
                    var id = window.location.pathname.match(/(courses)\/[0-9]{1,}/gi)[0].split("courses/");
                    ScaffoldClient.options['courseid'] = id[id.length - 1];
                }
            }
        }
        return ScaffoldClient.options.courseid;
    };

    m.getCsrfToken = function() {
        var csrfRegex = new RegExp('^_csrf_token=(.*)$');
        var csrf;
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
             var cookie = cookies[i].trim();
             var match = csrfRegex.exec(cookie);
             if (match) {
                  csrf = decodeURIComponent(match[1]);
                  break;
             }
        }
        return csrf;
    };

    m.getOrigin = function() {
        return ScaffoldClient.options.origin;
    };

	m.getPageTitle = function() {
		
		if (ScaffoldClient.options['pagetitle'] !== undefined) return ScaffoldClient.options['pagetitle'];
        var pageTitle = "";
        //get page title
        if (document.getElementsByClassName("page-title") && document.getElementsByClassName("page-title").length > 0 ){
            pageTitle = document.getElementsByClassName("page-title")[0].innerHTML;
        } else if (document.querySelectorAll(".ellipsible") && document.querySelectorAll(".ellipsible").length > 2){
            pageTitle = document.querySelectorAll(".ellipsible")[document.querySelectorAll(".ellipsible").length-1].innerText
        } else if (document.title){
            pageTitle = document.title;
        }

        ScaffoldClient.options['pagetitle'] = pageTitle;
        return ScaffoldClient.options.pagetitle;

	};

    m.merge = function() {
        var dst = {}
            ,src
            ,p
            ,args = [].splice.call(arguments, 0)
        ;
    
        while (args.length > 0) {
            src = args.splice(0, 1)[0];
            if (toString.call(src) == '[object Object]') {
                for (p in src) {
                    if (src.hasOwnProperty(p)) {
                        if (toString.call(src[p]) == '[object Object]') {
                            dst[p] = ScaffoldClient.merge(dst[p] || {}, src[p]);
                        } else {
                            dst[p] = src[p];
                        }
                    }
                }
            }
        }
    
       return dst;
    };

    m.fetchstatus = function(response) {
        if (response.status >= 200 && response.status < 300) {
             return Promise.resolve(response)
        } else {
             return Promise.reject(new Error(response.statusText))
        }
    };

    /*
    * Function which returns json from response
    */
    m.fetchjson = function(response) {
        return response.json()
    };

    {{{extention_functions}}}
    
	return m;

})(ScaffoldClient || {}, jQuery);