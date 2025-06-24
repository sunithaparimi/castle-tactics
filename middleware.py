class NoCacheMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        def custom_start_response(status, headers, exc_info=None):
            headers.append(('Cache-Control', 'no-cache, no-store, must-revalidate'))
            headers.append(('Pragma', 'no-cache'))
            headers.append(('Expires', '0'))
            return start_response(status, headers, exc_info)

        return self.app(environ, custom_start_response)
