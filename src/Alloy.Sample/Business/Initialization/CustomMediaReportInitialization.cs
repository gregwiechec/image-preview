using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Core;

namespace AlloyTemplates.Business.Initialization
{
    [ModuleDependency(typeof(InitializationModule))]
    public class CustomImagePreviewInitialization : IConfigurableModule
    {
        public void ConfigureContainer(ServiceConfigurationContext context)
        {
            context.ConfigurationComplete += (o, e) =>
            {
                //context.Services.AddTransient<IMediaHierarchyRootResolver, CustomMediaHierarchyRootResolver>();
                //context.Services.AddTransient<IMediaLoaderFilter, CustomMediaLoaderFilter>();
            };
        }

        public void Initialize(InitializationEngine context) { }

        public void Uninitialize(InitializationEngine context) { }

        public void Preload(string[] parameters){}
    }
}
