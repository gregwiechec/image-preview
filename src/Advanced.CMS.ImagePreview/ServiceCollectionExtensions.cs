using EPiServer.Shell.Modules;
using Microsoft.Extensions.DependencyInjection;

namespace Advanced.CMS.ImagePreview;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddImagePreview(this IServiceCollection services)
    {
        services.Configure<ProtectedModuleOptions>(
            pm =>
            {
                if (!pm.Items.Any(i =>
                        i.Name.Equals("Advanced.CMS.ImagePreview", StringComparison.OrdinalIgnoreCase)))
                {
                    pm.Items.Add(new ModuleDetails { Name = "Advanced.CMS.ImagePreview", Assemblies = { typeof(ServiceCollectionExtensions).Assembly.GetName().Name }  });
                }
            });
        return services;
    }
}
