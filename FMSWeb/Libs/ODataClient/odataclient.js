(function ($, undefined) {
    var onResponse = function (data, response, handler) {
        handler(odataclient.oDataQueryResult(data, response), response);
    };

    var errorCallbacks = [];

    var getResponse = function (response) {
        return { statusCode: response.statusCode, statusText: response.statusText, responseText: response.body };
    };

    window.odataclient = {
        oDataUrl: function (urlSegments) {
            var self,
            url,
            segments,
            stringify,
            parse,

            trimSlashes = function (str) {
                return str.replace(/^\/+|\/+$/g, '');
            },

            trimRightSlashes = function (str) {
                return str.replace(/\/+$/g, '');
            },

            trim = jQuery.trim;

            segments = {
                count: false,
                resource: null,
                root: null,
                value: false,
                options: {
                    callback: null,
                    expand: null,
                    filter: null,
                    orderby: null,
                    inlinecount: false,
                    skip: null,
                    skiptoken: null,
                    params: null,
                    top: null
                }
            };

            if (urlSegments !== undefined) {
                if ($.isPlainObject(urlSegments)) {
                    if (urlSegments.segments === undefined) {
                        $.extend(true, segments, urlSegments);
                    }
                    else {
                        $.extend(true, segments, urlSegments.segments);
                    }
                }
                else if (typeof urlSegments === 'string') {
                    $.extend(true, segments, { root: urlSegments });
                }
            }

            url = null;

            parse = function (urlString, root) {
                var self,
            temp,
            resourcePath,
            queryString,
            index,
            parts;
                root = root || this.segments.root;

                self = odataclient.oDataUrl();

                parts = urlString.split('?');

                if (parts.length > 2) {
                    //throw { name: 'invalid input string', message: 'input string is not valid, to many ? in the string' };
                }

                queryString = parts[1];

                self.segments.root = root;

                temp = parts[0].toUpperCase();
                root = root.toUpperCase();

                if (temp.indexOf(root) === 0) {
                    resourcePath = parts[0].slice(root.length);
                }
                else if ((index = temp.indexOf(root)) > 0) {
                    resourcePath = parts[0].slice(root.length + index);
                }
                else {
                    index = 0;
                    do {
                        root = root.slice(1);
                        index += 1;
                    } while (root.length > 0 && temp.indexOf(root) !== 0);

                    resourcePath = parts[0].slice(root.length);
                }

                parts = resourcePath.split('/$value');
                self.segments.value = parts.length === 2;
                resourcePath = parts[0];

                parts = resourcePath.split('/$count');
                self.segments.count = parts.length === 2;
                resourcePath = parts[0];

                if (!self.segments.value && (parts = resourcePath.split('/$links/')).length === 2) {
                    self.segments.resource = parts[0];
                } else {
                    self.segments.resource = resourcePath;
                }

                if (queryString !== undefined && queryString.length > 0) {
                    parts = queryString.split('&');

                    for (index = 0; index < parts.length; index += 1) {
                        parts[index] = parts[index].split('=');
                    }

                    while (parts.length > 0) {
                        temp = parts.pop();
                        switch (temp[0]) {
                            case '$top':
                                self.segments.options.top = temp[1];
                                break;
                            case '$skip':
                                self.segments.options.skip = temp[1];
                                break;
                            case '$orderby':
                                self.segments.options.orderby = temp[1];
                                break;
                            case '$filter':
                                self.segments.options.filter = temp[1];
                                break;
                            case '$expand':
                                self.segments.options.expand = temp[1];
                                break;
                            case '$skiptoken':
                                self.segments.options.skiptoken = temp[1];
                                break;
                            case '$inlinecount':
                                self.segments.options.inlinecount = temp[1] === 'allpages';
                                break;
                            case '$format':
                                self.segments.options.format = temp[1];
                                break;
                            default:
                                if (self.segments.options.params === null) {
                                    self.segments.options.params = {};
                                }
                                self.segments.options.params[temp[0]] = temp[1];
                                break;
                        }
                    }
                }

                return self;
            };

            stringify = function (urlObject) {
                var options,
            urlSegs,
            option,
            needAmpersand = false,
            resourcePath,
            qopts = '';

                urlObject = urlObject || this;
                urlSegs = urlObject.segments;
                options = urlSegs.options;

                if (urlSegs.root === null) {
                    return '';
                }

                resourcePath = urlSegs.resource !== null ? trimSlashes(trim(urlSegs.resource)) : '';

                if (resourcePath.indexOf('?') != -1) {
                    needAmpersand = true;
                }

                if (urlSegs.count) {
                    if (resourcePath.indexOf('?') == -1) {
                        resourcePath += '/$count';
                    } else {
                        resourcePath += '&?$count';
                    }
                }
                else if (urlSegs.value) {
                    resourcePath += '/$value';
                }

                for (option in options) {
                    if (option !== undefined && options[option] !== null) {
                        switch (option) {
                            case 'params':
                                for (option in options.params) {
                                    if (option !== undefined) {
                                        if (needAmpersand) {
                                            qopts += '&';
                                        }
                                        qopts += option + "=" + options.params[option];
                                        needAmpersand = true;
                                    }
                                }
                                break;
                            case 'inlinecount':
                                if (options.inlinecount) {
                                    if (needAmpersand) {
                                        qopts += '&';
                                    }
                                    qopts += "$inlinecount=allpages";
                                    needAmpersand = true;
                                    break;
                                }
                                break;
                            case 'format':
                                if (options[option] === 'json' && (urlSegs.count || urlSegs.value)) {
                                    break;
                                }
                            case 'callback':
                            case 'top':
                            case 'skip':
                            case 'filter':
                            case 'orderby':
                            case 'expand':
                            case 'skiptoken':
                                if (needAmpersand) {
                                    qopts += '&';
                                }
                                qopts += "$" + option + "=" + options[option];
                                needAmpersand = true;
                                break;
                        }
                    }
                }

                urlObject.url = trimRightSlashes(trim(urlSegs.root));
                urlObject.url += (resourcePath !== '' ? '/' + resourcePath : '');
                if (resourcePath.indexOf('?') == -1) {
                    urlObject.url += (qopts !== '' ? '?' + qopts : '');
                } else {
                    urlObject.url += (qopts !== '' ? '' + qopts : '');
                }
                return urlObject.url;
            };

            self = {};
            self.segments = segments;
            self.parse = parse;
            self.url = url;
            self.toString = self.toLocaleString = stringify;

            self.isLocalService = self.segments.root !== null &&
            // and root starts with something else than http: or https:
                          (!/^http:\/\/|https:\/\//i.test(self.segments.root) ||
            // or contains the window.location.protocol + '//' + window.location.host at index 0
                          self.segments.root.toLowerCase().indexOf(location.protocol + '//' + location.host) === 0);

            return self;
        },

        oData: function (url, options) {
            var self;
            self = {};
            self.settings = options || {};
            self.url = odataclient.oDataUrl(url);

            self.from = function (resourcePath) {
                return odataclient.oDataQuery.apply($.extend({}, this), [resourcePath]);
            };

            self.getUrl = function () {
                self = $.extend(true, {}, this);
                return self.url.toString();
            };

            self.getRequestObj = function () {
                var obj = {};
                self = $.extend(true, {}, this);
                obj.root = self.url.segments.root;
                obj.resource = self.url.segments.resource;
                obj.url = self.url.toString();
                obj.funcUrl = String.format("{0}/{1}", obj.root, obj.resource);
                var tempUrl = obj.funcUrl.replace("/", "\/");
                obj.param = obj.url.substring(tempUrl.length);
                return obj;
            };

            self.query = function (handlers, auth) {
                var options = {};
                if ($.isFunction(handlers)) {
                    handlers = { success: handlers };
                }

                self = $.extend(true, {}, this);

                var request = {
                    requestUri: self.url.toString(),
                    headers: { Accept: "application/json;odata=verbose, text/plain", "MaxDataServiceVersion": "3.0", Auth: auth },
                    //headers: { Accept: "application/json, text/plain", "DataServiceVersion": "3.0", Auth: auth },
                    method: "GET"
                };

                odataclient.callService(request, handlers.success, handlers.error);
            };

            self.create = function (resourcePath, data, handlers) {
                if (typeof handlers === "function")
                    handlers = { success: handlers };

                var self = $.extend(true, {}, this);
                self.url.segments.resource = resourcePath;

                var request = {
                    requestUri: self.url.toString(),
                    //headers: { Accept: "application/json, text/plain" },
                    //                    headers: { "Accept": "application/atom+xml",
                    //                        "Content-Type": "application/atom+xml;type=entry"
                    //                    },
                    method: "POST",
                    data: data
                };

                odataclient.callService(request, handlers.success, handlers.error);
            };

            self.update = function (resourcePath, data, handlers) {
                var self, options;

                if ($.isFunction(handlers)) {
                    handlers = { success: handlers };
                }

                // create new OData Query object
                self = $.extend(true, {}, this);
                self.url.segments.resource = resourcePath;

                var request = {
                    requestUri: self.url.toString(),
                    //headers: { Accept: "application/json, text/plain" },
                    method: "MERGE",
                    data: data
                };

                odataclient.callService(request, handlers.success, handlers.error);
            };

            self.remove = function (resourcePath, data, handlers) {
                if (typeof handlers === "function")
                    handlers = { success: handlers };

                var self = $.extend(true, {}, this);
                self.url.segments.resource = resourcePath;

                var request = {
                    requestUri: self.url.toString(),
                    //headers: { Accept: "application/json, text/plain" },
                    method: "DELETE",
                    data: data
                };

                odataclient.callService(request, handlers.success, handlers.error);
            };

            return self;
        },

        oDataBatch: function (rootUrl, options) {
            var self = {};
            self.options = options || {};
            self.rootUrl = rootUrl;

            var headers = {
                "Accept": "application/json, text/plain",
                "Content-Type": "application/atom+xml;type=entry",
                "DataServiceVersion": "2.0"
                //"Content-Type": "application/json;type=entry"
            };

            self.requests = [];
            self.createRequest = function (resourcePath, data, contentId) {
                var customHeaders = {};
                //$.extend(customHeaders, headers);

                if (contentId != undefined) {
                    customHeaders["Content-ID"] = contentId;
                }
                self.requests.push({ headers: customHeaders, requestUri: resourcePath, method: "POST", data: data });
            };

            self.callRequest = function (resourcePath, data, type) {
                if (!type) {
                    type = "GET";
                }
                self.requests.push({ headers: headers, requestUri: resourcePath, method: type, data: data });
            };

            self.addLinkRequest = function (sourcePath, targetProperty, targetPath, sourceKey, targetKey, contentId) {
                var customHeaders = {};
                $.extend(customHeaders, headers);

                if (contentId != undefined) {
                    customHeaders["Content-ID"] = contentId;
                }

                var data = { uri: targetPath + "(guid'" + targetKey + "')" };

                self.requests.push({ headers: customHeaders, requestUri: sourcePath + "(guid'" + sourceKey + "')/$links/" + targetProperty, method: "POST", data: data });
            };
            //             
            // self.deleteLinkRequest = function(){
            //                 
            // };

            self.removeRequest = function (resourcePath, data) {
                self.requests.push({ requestUri: resourcePath, method: "DELETE" });
            };

            self.updateRequest = function (resourcePath, data) {
                var customHeaders = {};
                $.extend(customHeaders, headers);

                customHeaders["Content-Type"] = "application/json";

                self.requests.push({ headers: customHeaders, requestUri: resourcePath, method: "MERGE", data: data });
            };

            self.readRequest = function (resourcePath) {
                if (typeof resourcePath === "object") {
                    self.requests.push({ headers: headers, requestUri: resourcePath.url.toString(), method: "GET" });
                } else {
                    self.requests.push({ headers: headers, requestUri: resourcePath, method: "GET" });
                }
            };

            self.from = function (resourcePath) {
                var req = {};
                req.url = odataclient.oDataUrl("");
                return odataclient.oDataQuery.apply($.extend({}, req), [resourcePath]);
            };

            self.execute = function (handlers) {
                var successHandler, errorHandler;
                if ($.isFunction(handlers)) {
                    successHandler = handlers;
                    errorHandler = handlers;
                } else {
                    successHandler = handlers.success;
                    errorHandler = handlers.error;
                }

                var headers = { "Accept": "application/atom+xml,application/xml", "Accept-Charset": "UTF-8" };
                odataclient.executeBatch(self.rootUrl, headers, self.requests, successHandler, errorHandler);
            };

            return self;
        },

        oDataQuery: function (resourcePath) {
            var self = this,
            value,
            count,
            params,
            orderby,
            top,
            skip,
            filter,
            expand,
            inlinecount;

            top = function (numberOfEntries) {
                var self;

                self = $.extend(true, {}, this);
                self.url.segments.options.top = numberOfEntries;

                return self;
            };
            orderby = function (orderbyQueryOption) {
                var self;

                self = $.extend(true, {}, this);
                self.url.segments.options.orderby = orderbyQueryOption;

                return self;
            };

            skip = function (numberOfEntries) {
                var self;

                self = $.extend(true, {}, this);
                self.url.segments.options.skip = numberOfEntries;

                return self;
            };

            filter = function (filter) {
                var self;

                self = $.extend(true, {}, this);
                self.url.segments.options.filter = filter;

                return self;
            };

            expand = function (entries) {
                var self;

                self = $.extend(true, {}, this);
                self.url.segments.options.expand = entries;

                return self;
            };

            inlinecount = function (inlinecount) {
                var self;

                inlinecount = inlinecount === undefined ? true : inlinecount;

                self = $.extend(true, {}, this);
                self.url.segments.options.inlinecount = inlinecount;

                return self;
            };

            params = function (params) {
                var self;

                self = $.extend(true, {}, this);

                self.url.segments.options.params = params;

                return self;
            };

            count = function (args) {
                var self,
                autoQuery = true,
                options = args;

                if (typeof args === 'boolean') {
                    autoQuery = args;
                } else if ($.isFunction(args)) {
                    options = { success: args };
                } else if (args === undefined) {
                    autoQuery = false;
                }

                self = $.extend(true, {}, this);

                self.url.segments.count = true;

                if (autoQuery) {
                    // execute the query
                    self.query(options);
                }
                else {
                    return self;
                }
            };

            value = function (args) {
                var self,
                autoQuery = true,
                options = args;

                if (typeof args === 'boolean') {
                    autoQuery = args;
                } else if ($.isFunction(args)) {
                    options = { success: args };
                } else if (args === undefined) {
                    autoQuery = false;
                }

                self = $.extend(true, {}, this);

                self.url.segments.value = true;

                if (autoQuery) {
                    // execute the query
                    self.query(options);
                }
                else {
                    return self;
                }
            };

            self.url.segments.resource = resourcePath;

            // add methods
            self.value = value;
            self.count = count;
            self.params = params;
            self.orderby = orderby;
            self.top = top;
            self.skip = skip;
            self.filter = filter;
            self.expand = expand;
            self.inlinecount = inlinecount;

            return self;
        },

        oDataQueryResult: function (data, response) {
            var self = {};

            if (!data) {
                self.data = [];
            } else if (data.results === undefined) {
                self.data = data;
            } else {
                self.data = data.results;
            }

            if (response !== undefined) {
                self.status = response.statusCode;
                self.statusText = response.statusText;
            } else if (data && data.response) {
                self.status = data.response.statusCode;
                self.statusText = data.response.statusText;
                self.responseText = data.response.body;
            }

            return self;
        },

        executeError: function (error, errorHandler) {
            if ($.isFunction(errorHandler)) {
                var errorData = {};
                errorData.data = {};
                errorData.data.response = error.response;
                errorData.responseText = error.response.body;
                errorHandler(errorData, error.statusText);
            }
        },

        executeQuery: function (request, successHandler, errorHandler) {
            OData.read(
                request,
                function (data, response) {
                    onResponse(data, response, successHandler);
                },
                errorHandler === undefined ? undefined :
                (function (error, response) {
                    onResponse(error, response, errorHandler);
                })
            );
        },

        callService: function (request, successHandler, errorHandler) {
            var success = function (data, response) {
                onResponse(data, response, successHandler);
            };
            var args = [request, success];
            var error
            if (errorCallbacks.length > 0) {
                error = function (error) {
                    if (errorHandler) errorHandler(getResponse(error.response), error, success);
                    for (var i = 0; i < errorCallbacks.length; i++) {
                        errorCallbacks[i](getResponse(error.response), error, success);
                    }
                };
            } else {
                error = errorHandler;
            }

            error && args.push(error);

            OData.request.apply(OData, args);
        },

        executeBatch: function (requestUrl, headers, requests, successHandler, errorHandler) {
            var request = {
                //headers: headers,
                requestUri: requestUrl + "/$batch",
                method: "POST",
                data: { __batchRequests: [{ __changeRequests: requests}] }
            };
            //OData.request(request, successHandler, errorHandler, OData.batchHandler);
            OData.request(request, function (data) {
                // Look for errors within the responses.
                var errorsFound = false;
                var isTimeout = false;
                for (var i = 0; i < data.__batchResponses.length; i++) {
                    var batchResponse = data.__batchResponses[i];
                    for (var j = 0; j < batchResponse.__changeResponses.length; j++) {
                        var changeResponse = batchResponse.__changeResponses[j];
                        if (changeResponse.message) {
                            if (changeResponse.response.statusCode == "401") {
                                isTimeout = true;
                            }
                            errorsFound = true;
                        }
                    }
                }

                if (errorsFound == true) {
                    if (isTimeout) {
                        data.statusCode = 401;
                        data.request = request;
                        data.successHandler = successHandler;
                        data.errorHandler = errorHandler;
                    } else {
                        data.statusCode = 500;
                    }
                }

                successHandler(data);
                // Display whether any errors were found, and a JSON-ified payload.
                //alert("Result (errors found=" + errorsFound + "):\r\n" + window.JSON.stringify(data));
            }, errorHandler, OData.batchHandler);
        },

        onError: function (handler) {
            errorCallbacks.push(handler);
        }
    };
})(jQuery);
