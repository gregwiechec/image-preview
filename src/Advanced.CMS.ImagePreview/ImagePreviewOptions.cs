using EPiServer.ServiceLocation;

namespace Advanced.CMS.ImagePreview;

[Options]
public class ImagePreviewOptions
{
    public IEnumerable<string> AdditionalProperties { get; set; } = Enumerable.Empty<string>();
}
