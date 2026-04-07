using InsiderOUT.Server.Data.Models.Dto;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

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

        private bool IsFileLocked(string file)
        {
            try
            {
                using var stream = File.Open(file, FileMode.Open, FileAccess.Read, FileShare.None);
                return false;
            }
            catch
            {
                return true;
            }
        }

        private async Task ProcessNewFilesAsync()
        {
            var allFiles = Directory.GetFiles(_watchFolder);


            foreach (var tmp in allFiles.Where(f => f.EndsWith(".log.tmp")))
            {
                if (!IsFileLocked(tmp))
                {
                    File.Delete(tmp);
                    _logger.LogInformation($"Deleted unlocked .log.tmp file: {tmp}");
                }
                else
                {
                    _logger.LogDebug($"Skipping locked .log.tmp file: {tmp}");
                }
            }


            var logFiles = allFiles
                .Where(f => f.EndsWith(".log"))
                .OrderBy(f => File.GetCreationTime(f))
                .ToList();

            if (logFiles.Count == 0)
                return;

            // If only one .log file exists, it's almost always the active NXLog file → skip
            if (logFiles.Count == 1)
                return;

            // Process all except the newest .log file
            var filesToProcess = logFiles.Take(logFiles.Count - 1);

            foreach (var file in filesToProcess)
            {
                if (IsFileLocked(file))
                {
                    _logger.LogWarning($"Skipping locked .log file: {file}");
                    continue;
                }

                try
                {
                    var lines = File.ReadAllLines(file);

                    using var scope = _scopeFactory.CreateScope();
                    var incidentService = scope.ServiceProvider.GetRequiredService<IIncidentService>();

                    bool success = true;

                    foreach (var line in lines)
                    {
                        try
                        {
                            var evt = NxLogParser.ParseLine(line);
                            if (evt != null)
                                await incidentService.CreateFromNxLogAsync(evt);
                        }
                        catch (Exception ex)
                        {
                            success = false;
                            _logger.LogError(ex, $"Error processing line in {file}");
                        }
                    }

                    if (success)
                    {
                        File.Delete(file);
                        _logger.LogInformation($"Deleted processed .log file: {file}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Unexpected error processing file: {file}");
                }
            }
        }
    }
}
