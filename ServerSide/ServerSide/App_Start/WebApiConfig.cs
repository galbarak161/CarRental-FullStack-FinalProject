using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ServerSide
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // CORS configuration.
            var corsConfig = new EnableCorsAttribute(
                "*",
                string.Join(
                    ",",
                    "Accept",
                    "Accept-Encoding",
                    "Authorization",
                    "Origin",
                    "Content-Type"),
                string.Join(
                    ",",
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE"),
                string.Join(
                    ",",
                    "Content-Encoding"))
            {
                SupportsCredentials = true
            };
            config.EnableCors(corsConfig);

        }
    }
}
