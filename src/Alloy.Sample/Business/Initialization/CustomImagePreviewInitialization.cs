using Advanced.CMS.ImagePreview;
using AlloyTemplates.Models.Media;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using Microsoft.Extensions.DependencyInjection;

namespace AlloyTemplates.Business.Initialization
{
    [ModuleDependency(typeof(InitializationModule))]
    public class CustomImagePreviewInitialization : IConfigurableModule
    {
        public void ConfigureContainer(ServiceConfigurationContext context)
        {
            context.ConfigurationComplete += (o, e) =>
            {
                context.Services.Configure<ImagePreviewOptions>(o =>
                {
                    o.AdditionalProperties = new[] {nameof(ImageFile.Copyright), nameof(ImageFile.AltText)};
                });
            };
        }

        public void Initialize(InitializationEngine context) { }

        public void Uninitialize(InitializationEngine context) { }
    }
}
