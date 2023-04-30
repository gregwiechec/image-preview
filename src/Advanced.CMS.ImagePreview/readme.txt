Advanced.CMS.ImagePreview

Installation
============


In order to start using ImagePreview you need to add it explicitly to your site.
Please add the following statement to your Startup.cs

public class Startup
{
    ...
    public void ConfigureServices(IServiceCollection services)
    {
        ...
        services.AddImagePreview();
        ...
    }
    ...
}


Configuring additional properties
=================================

Ton configure addtional properties displayed in the tooltip use Advanced.CMS.ImagePreview.ImagePreviewOptions

public class Startup
{
    ...
    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<ImagePreviewOptions>(o =>
        {
            o.AdditionalProperties = new[] {nameof(ImageFile.Copyright), nameof(ImageFile.AltText)};
        });
    ...
}

Translating additional properties
=================================

To translate addtional properties use language files

<imagepreview>
    <property>
        <alttext>Alt<//alttext>
    </property>
</imagepreview>

