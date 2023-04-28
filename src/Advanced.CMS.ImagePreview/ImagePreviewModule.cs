using EPiServer.Framework.Localization;
using EPiServer.Framework.TypeScanner;
using EPiServer.Framework.Web.Resources;
using EPiServer.ServiceLocation;
using EPiServer.Shell.Modules;
using Microsoft.Extensions.FileProviders;

namespace Advanced.CMS.ImagePreview;

public class ImagePreviewModule : ShellModule
{
    public ImagePreviewModule(string name, string routeBasePath, string resourceBasePath) : base(name, routeBasePath,
        resourceBasePath)
    {
    }

    public ImagePreviewModule(string name, string routeBasePath, string resourceBasePath,
        ITypeScannerLookup typeScannerLookup, IFileProvider virtualPathProvider) : base(name, routeBasePath,
        resourceBasePath, typeScannerLookup, virtualPathProvider)
    {
    }

    public override ModuleViewModel CreateViewModel(ModuleTable moduleTable,
        IClientResourceService clientResourceService)
    {
        var options = ServiceLocator.Current.GetInstance<ImagePreviewOptions>();
        return new ImagePreviewViewModel(this, clientResourceService,
            ServiceLocator.Current.GetInstance<LocalizationService>(), options);
    }
}

public class ImagePreviewViewModel : ModuleViewModel
{
    public IEnumerable<KeyValuePair<string, string>> AdditionalProperties { get; set; }
    private LocalizationService _localizationService;

    public ImagePreviewViewModel(ShellModule shellModule, IClientResourceService clientResourceService,
        LocalizationService localizationService, ImagePreviewOptions imagePreviewOptions) :
        base(shellModule, clientResourceService)
    {
        _localizationService = localizationService;
        this.AdditionalProperties = GetAdditionalProperties(imagePreviewOptions.AdditionalProperties);
    }

    private IEnumerable<KeyValuePair<string, string>> GetAdditionalProperties(IEnumerable<string> additionalProperties)
    {
        if (additionalProperties != null)
        {
            foreach (var additionalProperty in additionalProperties)
            {
                var key = System.Text.Json.JsonNamingPolicy.CamelCase.ConvertName(additionalProperty);
                var value = _localizationService.GetString("imagepreview/propert/" +
                                                           additionalProperty.ToLowerInvariant(), additionalProperty);
                yield return new KeyValuePair<string, string>(key, value);
            }
        }
    }
}
