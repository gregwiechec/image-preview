# image-preview
Sometimes site contain a lot of similar iamges. When adding an image to an image property or the a Content Area it’s difficult to determinate which content to select based on the small thumbnail and a name that may not be descriptive. The Editor has to open the image to see the full version, but by doing so he loses the context of the page he is editing. That’s why I prepared Image Preview nuget package. This is a small extension to Assets Pane that allows Editor to see a preview of an image, without having to change the context.
![Image preview extension overview](/assets/image_preview.png "Image preview extension overview")

The dialog is displayed when Editor clicks on image thumbnail in the assets pane. It a popover showed next to the image thumbnail. It contains:

* **Image preview** – allows you to preview the full version of the image without having to change the context
* **Name** – name of the media file renderred as a link to the public version of the image
* **Dimensions and size** – information about size and dimensions of previewed media file
* **Changed and Changed by** – information about who and when last modified the file
* **References** – clickable list of all contants where the image was used. Thanks to it, the editor can check how popular the image is.
* **Additional properties** – a list of additional string properties available on the media model that we want to use when previewing

### Configuring additional properties ###

By default, the plugin does not require any configuration, but in addition to the basic information displayed in the dialog, you can configure the list of additional properties available in the model that you want to show. For example, if an ImageFile has the AltText and Copyrights properties, you can show them in the dialog using the ImagePreviewOptions option, as shown in the example below:

```c#
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<ImagePreviewOptions>(o =>
    {
        o.AdditionalProperties = new[] {nameof(ImageFile.Copyright), nameof(ImageFile.AltText)};
    });
}
```

Additional field labels are configured using language files, under “/property/alttext/[property name]” keys. For example, if the AltText property should be displayed as Alt, then the key should be:

```xml
<imagepreview>
  <property>
    <alttext>Alt</alttext>
  </property>
</imagepreview>
```

## Develop

* setup 
* build
* iisexpress
