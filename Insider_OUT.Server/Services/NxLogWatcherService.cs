using Insider_OUT.Server.Data.Models.Dto;

namespace InsiderOUT.Server.Services
{
    public class NxLogWatcherService : BackgroundService
    {
        private readonly ILogger<NxLogWatcherService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly string _watchFolder;

        public NxLogWatcherService(
            ILogger<NxLogWatcherService> logger,
            IServiceScopeFactory scopeFactory,
            IConfiguration config)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;

            _watchFolder = config["NxLog:WatchFolder"]
                ?? throw new Exception("NxLog:WatchFolder not configured.");

            Directory.CreateDirectory(_watchFolder);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("NXLogWatcherService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessNewFilesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing NXLog files.");
                }

                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }

            _logger.LogInformation("NXLogWatcherService stopped.");
        }

        private async Task ProcessNewFilesAsync()
        {
            var files = Directory.GetFiles(_watchFolder, "*.log");

            foreach (var file in files)
            {
                _logger.LogInformation($"Processing NXLog file: {file}");

                bool success = true;
                var lines = File.ReadAllLines(file);

                // Create a DI scope for this file
                using var scope = _scopeFactory.CreateScope();
                var incidentService = scope.ServiceProvider.GetRequiredService<IIncidentService>();

                foreach (var line in lines)
                {
                    try
                    {
                        var evt = NxLogParser.ParseLine(line);
                        if (evt == null)
                            continue;

                        await incidentService.CreateFromNxLogAsync(evt);
                    }
                    catch (Exception ex)
                    {
                        success = false;
                        _logger.LogError(ex, $"Error processing line in file {file}");
                    }
                }

                if (success)
                {
                    File.Delete(file);
                    _logger.LogInformation($"Successfully processed and deleted NXLog file: {file}");
                }
                else
                {
                    _logger.LogWarning($"NXLog file NOT deleted due to errors: {file}");
                }
            }
        }
    }
}
