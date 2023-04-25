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
        return new ImagePreviewViewModel(this, clientResourceService, options);
    }
}

public class ImagePreviewViewModel : ModuleViewModel
{
    public ImagePreviewViewModel(ShellModule shellModule, IClientResourceService clientResourceService,
        ImagePreviewOptions imagePreviewOptions) :
        base(shellModule, clientResourceService)
    {
        //TODO: add options for additional properties
    }
}
